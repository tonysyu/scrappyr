Scrapps
=======

A simple app for managing scraps of data.


Quickstart
----------

Run the following commands to bootstrap your environment.


```
cd path/to/directory/containing/this/file
pip install -r requirements.txt
python manage.py db init
python manage.py server
```


Deployment
----------

In your production environment, make sure you have an application.cfg
file in your instance directory.


Shell
-----

To open the interactive shell, run:

    python manage.py shell

By default, you will have access to `app` and `db`.


Migrations
----------

Whenever a database migration needs to be made, run the following command:

    python manage.py db migrate

This will generate a new migration script. Then run:

    python manage.py db upgrade

to apply the migration.

For a full migration command reference, run `python manage.py db --help`.


What's in a name
----------------

I wanted to name this scrappy (an *app* built with *py*thon for managing
*scrap*s of data), but there's already a python library named
[scrapy](http://scrapy.org/). "Scrapps" seemed like a decent alternative.
Ignore any undertones of "crap" that might arise in your head.


Credits
-------

This is adapted from Vincenzo Prignano's
[TodoApp](https://github.com/vinceprignano/todoapp), which itself was adapted
from a [TodoMVC](http://todomvc.com) implementation by
[Christoph Burgdorf](http://twitter.com/cburgdorf),
[Eric Bidelman](http://ericbidelman.com),
[Jacob Mumm](http://jacobmumm.com), and
[Igor Minar](http://igorminar.com).

