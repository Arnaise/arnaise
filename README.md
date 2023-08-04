## SETUP BACKEND:
1. pip install -r requirements.txt
2. python manage.py createsuperuser (CREATE A SUPER ADMIN CREDENTIALS)  
3. python manage.py makemigrations  
4. python manage.py migrate  
5. python manage.py runserver  
6. Head to 'http://127.0.0.1:8000/admin', you'll see a login screen, enter SUPER USER password and there you can manage all the data

## SETUP FRONTEND:

1. cd client
2. npm i
3. npm run start


If there happens FRONTEND, BACKEND connection errors OR you are not able to login
## CHANGE URLS:  
1. Open "client\src\CONSTANT.js"
2. Change the urls in "server(backend)" and "client(frontend)"

3. Open "project\settings.py"
4. Add your url in "ALLOWED_HOSTS" - Line 29

In case you want to reset everything
## CLEAR DB:  
1. Delete 'database file' -- db.sqlite3
2. Delete folders name as "__pycache__"  
3. In the "api/migration" folder delete everything EXCEPT "__init__.py"  
4. run commands "makemigrations" and "migrate"
5. make yourself a superuseradmin
6. head to http://127....../admin  
7. create a admin user and boom login on frontend and start  
