use BlogDB;

insert into roles(role) values
    ('ADMIN'),
    ('FOLLOWER');

insert into `users`(`firstName`, `lastName`, `username`, `bio`, `email`, `password`, `skills`, `avatarImage`, `roleId`)
    values
        ('Ilya', 'Novak', 'Iluhaprog', "I'm programmer!", 'admin@admin.com', '$2b$10$GMcPVbBGhNb3lL9/3EdTwuT1vJepY/z61j6eRy0ic2wu3eJ4yGYiC', 'node, js, react', 'default.png', 1);