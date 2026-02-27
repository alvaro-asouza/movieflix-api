import express from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

// GET, POST, PUT, DELETE, PATCH

app.get("/movies", async (req, res) => {
    const movies = await prisma.movie.findMany();
    res.json(movies);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
