"use client";
import ScrollUp from "@/components/Common/ScrollUp";

import Hero from "@/components/Hero";
import { Inter } from "@next/font/google";
import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import ImageBox from "@/components/ImageBox";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [result, setResult] = useState([]);
  const [classLabels, setClassLabels] = useState([]);
  const [calories, setCalories] = useState(null);
  const [type, setType] = useState(null);

  const imageRef = useRef();
  const textInputRef = useRef();
  const fileInputRef = useRef();

  const labels = {
    0: "apple",
    1: "banana",
    2: "beetroot",
    3: "bell pepper",
    4: "cabbage",
    5: "capsicum",
    6: "carrot",
    7: "cauliflower",
    8: "chilli pepper",
    9: "corn",
    10: "cucumber",
    11: "eggplant",
    12: "garlic",
    13: "ginger",
    14: "grapes",
    15: "jalapeno",
    16: "kiwi",
    17: "lemon",
    18: "lettuce",
    19: "mango",
    20: "onion",
    21: "orange",
    22: "paprika",
    23: "pear",
    24: "peas",
    25: "pineapple",
    26: "pomegranate",
    27: "potato",
    28: "radish",
    29: "soybeans",
    30: "spinach",
    31: "sweetcorn",
    32: "sweetpotato",
    33: "tomato",
    34: "turnip",
    35: "watermelon",
  };

  const fruits = [
    "apple",
    "banana",
    "grapes",
    "kiwi",
    "lemon",
    "mango",
    "orange",
    "pomegranate",
    "pineapple",
    "watermelon",
  ];

  const vegetables = [
    "beetroot",
    "bell pepper",
    "cabbage",
    "capsicum",
    "carrot",
    "cauliflower",
    "corn",
    "cucumber",
    "eggplant",
    "spinach",
    "sweetcorn",
    "sweetpotato",
    "garlic",
    "tomato",
    "turnip",
  ];
  const fetchCalory = async (prediction) => {
    // try {
    //   const url = `https://www.google.com/search?&q=calories+in+${prediction}`;
    //   const response = await fetch(url);
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }
    //   const data = await response.text();
    //   const parser = new DOMParser();
    //   console.log("res===>", parser.parseFromString(data, "text/html"));
    //   const doc = parser.parseFromString(data, "text/html");
    //   const calorieElement = doc.querySelector(".Z0LcW an_fna");
    //   if (calorieElement) {
    //     setCalories(calorieElement.textContent);
    //   } else {
    //     throw new Error("Calories not found on the page");
    //   }
    // } catch (e) {
    //   console.log("Can't able to fetch the Calories");
    //   console.error(e);
    // }
  };

  // window.handleCaloriesResponse = (data) => {
  //   const caloriesElement = data;
  //   setCalories(caloriesElement);
  // };

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };
  const uploadTrigger = () => {
    //@ts-ignore
    fileInputRef.current.click();
  };
  const handleInputChange = (e) => {
    setImageUrl(e.target.value);
    setResult([]);
  };

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    setIsLoading(true);
    try {
      const mobilenetModel = await tf.loadLayersModel("./model/model.json");
      setModel(mobilenetModel);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading the model:", error);
      setIsLoading(false);
    }
  };

  const detectImage = async () => {
    if (!model) {
      return;
    }

    if (!imageRef.current || !imageUrl) {
      return;
    }

    setIsLoading(true);

    try {
      const img = imageRef.current;
      const imageTensor = tf.browser
        .fromPixels(img)
        .resizeBilinear([224, 224])
        .toFloat();
      const offset = tf.scalar(127.5);
      const normalized = imageTensor.sub(offset).div(offset).expandDims(0);

      const predictions = await model.predict(normalized).data();

      const topClassIndex = predictions.indexOf(Math.max(...predictions));

      const topClassName = labels[topClassIndex];

      if (fruits.includes(topClassName.toLowerCase())) {
        setType("Fruit");
      } else if (vegetables.includes(topClassName.toLowerCase())) {
        setType("Vegetable");
      } else {
        setType("Unknown");
      }

      const classLabels = Array.from(Array(predictions.length).keys()).map(
        (classIndex) => {
          return {
            className: labels[classIndex],
            probability: predictions[classIndex],
          };
        }
      );

      setResult([
        { className: topClassName, probability: predictions[topClassIndex] },
      ]);

      setClassLabels(classLabels);
      fetchCalory(topClassName);
      setIsLoading(false);
    } catch (error) {
      console.error("Error while detecting image:", error);
      setIsLoading(false);
    }
  };
  return (
    <>
      <ScrollUp />
      <Hero
        upload={uploadTrigger}
        uploadImage={uploadImage}
        fileInputRef={fileInputRef}
        isLoading={isLoading}
      />

      <ImageBox
        imageRef={imageRef}
        imageUrl={imageUrl}
        type={type}
        result={result}
        detect={detectImage}
        isLoading={isLoading}
      />
    </>
  );
}
