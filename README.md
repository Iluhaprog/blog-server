# Backend of my site


1. To run you need **nodejs**, **mysql**, **npm**
2. Next, you must clone this project by writing **git clone https://github.com/Iluhaprog/blog-server.git**
3. Now you should go to the project directory and write **npm install**
4. create a ***.env*** file for config and write the following there:
    ~~~STATIC_FILES=uploads
    DBHOST=localhost
    DBPORT=3306
    DBUSER={your database user}
    DBPASS={database user password}
    DBNAME={database name}
    
    PORT=3000
    ORIGIN=
    SECRET=secret
    JWT_EXPIRES_IN=1d
5. You need to enter the following commands 
    ***npm run build***
    ***node dist/console.js new locale ru***
    ***node dist/console.js new locale en***
    ***node dist/console.js new user <login> <password> <email>*** Instead of <login> <password> <email>, enter your login password and email.
    ***node dist/main.js***
    *Here we created a build, then created the languages supported by the project and the user*
6. Now go to your browser at http://localhost:{PORT} (you specified this port in **.env**). Here you can familiarize yourself with the api of this service.