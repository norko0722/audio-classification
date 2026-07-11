FROM python:3.12
WORKDIR /
COPY ./requirements.txt /code/requirements.txt
RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./ /code/app
CMD ["fastapi", "run", "/code/app/main.py", "--port", "80"]
