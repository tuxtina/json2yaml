FROM node:4.4.2
RUN npm install -g npm@3
RUN npm install -g typings
RUN npm install -g vsce
RUN useradd --create-home --shell /bin/bash user
RUN mkdir -p /project
RUN chown user /project

USER user
WORKDIR /project

CMD [ "bash" ]
