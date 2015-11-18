from redis import Redis
from rq import Queue
import ConfigParser
import sys
import os
import subprocess

# We are performing deployment using 2 containers.
# First container is the stable container that contains stable code.
# On second container , we deploy new code. This might be used for canary releases.

def deploy(commit):
    # Run container with new release
    p = subprocess.Popen("docker stop ncsu/canary_server" , stdout=subprocess.PIPE, shell=True)
    (output, err) = p.communicate()
    print(output)
    print(err)

    p = subprocess.Popen("docker rm ncsu/canary_server" , stdout=subprocess.PIPE, shell=True)
    (output, err) = p.communicate()
    print(output)
    print(err)

    # fetch new stable code
    p = subprocess.Popen("git pull --rebase origin master" , stdout=subprocess.PIPE, shell=True)
    (output, err) = p.communicate()
    print(output)
    print(err)

    p = subprocess.Popen("git reset --hard " + commit , stdout=subprocess.PIPE, shell=True)
    (output, err) = p.communicate()
    print(output)
    print(err)

    # Build the image with new code
    p = subprocess.Popen("docker build -t ncsu/canary_server ." , stdout=subprocess.PIPE, shell=True)
    (output, err) = p.communicate()
    print(output)
    print(err)

    p = subprocess.Popen("docker run -p 3005:3000 -d ncsu/canary_server" , stdout=subprocess.PIPE, shell=True)
    (output, err) = p.communicate()
    print(output)
    print(err)

def main():
    config = ConfigParser.RawConfigParser()
    config.read('config.ini')
    redis_host = config.get('redis', 'redis_host')
    redis_port = config.getint('redis', 'redis_port')
    redis_pass = config.get('redis', 'redis_pass')

    redis_conn = Redis(host = redis_host, port = redis_port, password = redis_pass)
    pubsub = redis_conn.pubsub()
    pubsub.subscribe('deploy_queue')

    # print('Listening to {channel}'.format(**locals()))

    os.chdir("/root/BasicExpressSite/")

    while True:
        for item in pubsub.listen():
            # Add the deployment to a queue
            commit_id = item['data']
            if commit_id:
                deploy(commit_id)

if __name__ == '__main__':
    main()
