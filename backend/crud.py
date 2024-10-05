import mongoConnect as mc

if __name__ == "__main__":
    uri = "mongodb+srv://wangyukun721:ii4GZUByt7WrDxLL@cluster0.ld92j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    with mc.connect_to_mongoDB(uri) as client:
        mc.upload(r'C:\Users\81548\OneDrive\文档\GitHub\Team-JSSH-HTV9\backend\test.txt', client)