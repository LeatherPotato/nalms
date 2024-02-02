# handles project setup as python package to allow files to be imported

from setuptools import setup

setup(
    name='backend',
    packages=['backend'],
    include_package_data=True,
    install_requires=[
        'flask'
    ],
)