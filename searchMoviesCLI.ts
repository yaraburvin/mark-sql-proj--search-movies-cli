import { question } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

async function searchMovies() {
    
    const client = new Client({ database: 'omdb' });
    
    await client.connect();
    console.log("Welcome to search-movies-cli!");
    let readlineSync = require('readline-sync');
    while (true) {
        let searchTerm:string =readlineSync.question('Search for what movie?');
        if (searchTerm === 'q'){
            break
        }
        else {
            const text = "select id, name, date, runtime, budget from movies where lower(name) like $1 order by date desc limit 10";
            const values = [`%${searchTerm.toLowerCase()}%`];
            const result = await client.query(text, values);
            console.table(result.rows);
        }

      }
    await client.end();
    
}

searchMovies()
