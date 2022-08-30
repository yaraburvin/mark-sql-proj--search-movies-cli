import { question } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

async function searchMovies() {
    
    const client = new Client({ database: 'omdb' });
    
    await client.connect();
    console.log("Welcome to search-movies-cli!");
    while (true) {
        const readlineSync = require('readline-sync'),
          list = ['Search', 'See Favourites'],
          index = readlineSync.keyInSelect(list, 'Choose an action: '); 
        if (list[index] === 'Search') {
    
            let searchTerm:string =readlineSync.question('Search for what movie? (press q to quit) ');
            if (searchTerm === 'q'){
                break
            }
            else {
                const text_movies = "select id, name, date, runtime, budget from movies where lower(name) like $1 order by date desc limit 10";
                let values = [`%${searchTerm.toLowerCase()}%`];
                const result = await client.query(text_movies, values);
                console.table(result.rows);
                const row_number = readlineSync.question('Choose a movie row_number to favourite (choose from 0 to 9): ');
                const favourite  = result.rows[row_number]
                const text_favourite  = "insert into favourites (movie_id,name) values ($1,$2)"
                values = [favourite['id'], favourite['name']]
                await client.query(text_favourite, values)
                console.log(`Saving favourite movie - ${favourite['name']}`)
                
            }
        }
        else if (list[index] === 'See Favourites'){
            const text = "select * from favourites"
            const result = await client.query(text)
            console.table(result.rows)
        }
        else {
            break
        }

      }
    await client.end();
    
}



searchMovies()
