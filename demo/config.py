import os.path as pth
LOCAL_DIR = pth.dirname(pth.abspath(__file__))

DEBUG = True
SECRET_KEY = 'development-key'
SQLALCHEMY_DATABASE_URI = 'sqlite:////{}/scrappyr.db'.format(LOCAL_DIR)
