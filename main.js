const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080; // Cambiado: Incluir soporte para puerto dinámico

app.get('/pokemon/:id', async (req, res) => {
    try {
        const pokemonId = req.params.id;

        // Obtener los detalles del Pokémon de la PokeAPI
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemonData = pokemonResponse.data;

        // Obtener la URL de la especie directamente desde la respuesta del Pokémon
        const speciesUrl = pokemonData.species.url;
        const speciesResponse = await axios.get(speciesUrl);
        const speciesData = speciesResponse.data;

        // Filtrar la descripción en español del Pokémon
        const description = speciesData.flavor_text_entries.find(
            (entry) => entry.language.name === 'es'
        ).flavor_text;

        // Extraer los tipos del Pokémon utilizando desestructuración de objetos
        const types = pokemonData.types.map(({ type }) => type.name);

        // Crear un objeto con la información relevante del Pokémon
        const pokemonInfo = {
            name: pokemonData.name,
            id: pokemonData.id,
            height: pokemonData.height,
            weight: pokemonData.weight,
            types: types,
            description: description,
        };

        // Enviar la respuesta JSON con la información del Pokémon
        res.json(pokemonInfo);
    } catch (error) {
        // Manejar el error si no se encuentra el Pokémon
        res.status(404).json({ error: 'Pokémon not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
