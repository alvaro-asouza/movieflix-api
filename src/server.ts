import express from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// GET, POST, PUT, DELETE, PATCH

app.get("/movies", async (req, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc",
        },
        include: {
            genres: true,
            languages: true,
        },
    });
    res.json(movies);
});

app.post("/movies", async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;

    try {
        const movieWhithSameTitle = await prisma.movie.findFirst({
            where: {
                title: { equals: title, mode: "insensitive" },
            },
        });

        if (movieWhithSameTitle) {
            return res.status(409).send({ message: "já existe um filme com esse nome" });
        }
        const movie = await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: release_date ? new Date(release_date) : null,
            },
        });

        return res.status(201).json(movie);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "falha ao cadastrar filme" });
    }
});

app.put("/movies/:id", async (req, res) => {
    //pegar o id do filme a ser atualizado
    const id = Number(req.params.id);

    try {
        const movie = await prisma.movie.findUnique({
            where: {
                id
            },
        });

        if (!movie) {
            return res.status(404).send({ message: "filme não encontrado" });
        }

        const data = { ...req.body };
        data.release_date = data.release_date ? new Date(data.release_date) : undefined;
        //pegar os dados do filme a ser atualizado e atualizar ele no prisma
        await prisma.movie.update({
            where: {
                id
            },
            data: data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "falha ao atualizar filme" });
    }
    //retornar os dados corretos informando que o filme foi atualizado
    res.status(200).send();
});

app.delete("/movies/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const movie = await prisma.movie.findUnique({
            where: { id }
        });

        if (!movie) {
            return res.status(404).send({ message: "filme não encontrado" });
        }

        await prisma.movie.delete({
            where: {
                id,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "falha ao deletar filme" });
    }
    res.status(200).send();
});

app.get("/movies/:genreName", async (req, res) => {
    try {
        const moviesFilteredByGenre = await prisma.movie.findMany({
            include: {
                genres: true,
                languages: true
            },
            where: {
                genres: {
                    name: { equals: req.params.genreName, mode: "insensitive" }
                }
            } });
        res.status(200).send(moviesFilteredByGenre);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "falha ao buscar filmes por gênero" });
    }

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
