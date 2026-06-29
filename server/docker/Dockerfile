FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y \
    g++ \
    openjdk-17-jdk \
    python3

RUN useradd -m judge

USER judge

WORKDIR /workspace

CMD ["bash"]