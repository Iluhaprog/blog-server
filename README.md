# This is backend of  blog.

It describes how to run a *test* for this application, 
how to run it in *development* mode and just run *it locally*

### To run the above you must have installed:
* npm 
* nodejs
* mysql 

_Also you must create a **.env** file in the root of the project_

In it you need to specify the following fields

|Field name     | Description           |
|---------------|-----------------------|
|DB_NAME        | Database name         |
|DB_USER        | Database user         |
|DB_PASS        | DB user password      | 
|DB_HOST        | Database host         |
|PORT           | App port              |
|SESSION_SECRET | Secret session string |
|CONFIRM_URL    | this is the url to which you will need to pass to verify the user account: host is an application or another that interacts with the api of this application|
|ADMIN          | Id of admin role in database |
|FOLLOWER       | Id of follower role in database |
|ACCESS_TOKEN   | Access token of your app in dropbox |
|MAIL_USER      | Mail of user from which letters will be sent |
|MAIL_PASS      | Password of mail user |
|MAX_LIMIT          | Max number for pagination limit |
|ORIGIN_URL         | Allow origin url |

### Example:
```
    # database
    DB_NAME=BlogDB
    DB_USER=user
    DB_PASS=pass
    DB_HOST=localhost
    
    # app
    PORT=3001
    SESSION_SECRET=secret
    CONFIRM_URL=http://localhost:3000
    ORIGIN_URL=http://localhost:3000

    
    # roles id
    ADMIN=1
    FOLLOWER=2
    
    # dropbox
    ACCESS_TOKEN=laskdmioendiqwleifn-AKjnsiuqnwsmdna/asdas
    
    # mail
    MAIL_USER=user@user.com
    MAIL_PASS=userpassword

    # pagination
    MAX_LIMIT=20
```

### To run you have to create a database:
1. Move to __src/database/__ dir 
1. Login to the database
1. Run __source blog.sql__
1. Run __source init.sql__

_**source init.sql** will create an admin with **email admin@admin.com** and **password 12345**_

### Now you can run the application:
* With dev mode use **npm run dev**
* If you just want to run, then use **npm start**
* If you want run tests use **npm test**