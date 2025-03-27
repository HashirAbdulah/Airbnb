# Use a stable Python image
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Avoid generating .pyc files and buffer output
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies (including netcat)
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size

# Upgrade pip
RUN pip install --upgrade pip

# Copy the requirements.txt and install dependencies
COPY ./requirements.txt /app/
RUN pip install -r /app/requirements.txt

# Copy entrypoint.sh and set permissions
COPY ./entrypoint.sh /app/
RUN sed -i 's/\r$//g' /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Copy the rest of the project files into the container
COPY . /app/

# Set the entrypoint script to be run when the container starts
ENTRYPOINT ["/app/entrypoint.sh"]

# Command to run the app (this will be passed to entrypoint.sh as arguments)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
