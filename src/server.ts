import express from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
