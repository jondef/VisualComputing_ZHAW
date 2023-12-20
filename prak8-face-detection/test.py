from deepface import DeepFace

result = DeepFace.verify(img1_path="img1.png", img2_path="img2.jpg")

objs = DeepFace.analyze(img_path = "img2.jpg",
        actions = ['age', 'gender', 'race', 'emotion']
)
print(objs)
