To run project: 
in terminal enter cory-backend ```cd cory-backend```
run ```docker compose up --build```
run migration script ``` npx sequelize-cli db:migrate --url 'postgres://admin:password@localhost:5432/cory_db'```
run ``` docker compose down```
run ```docker compose up --build```


enter cory frontend
```cd ..```
``` cd cory-frontend```
```docker compose up --build```

navigate to localhost:5173 in browser, enjoy! :)
