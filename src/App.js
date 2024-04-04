
import { IoMdSearch } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";

import { FaTemperatureThreeQuarters, FaTemperatureEmpty, FaTemperatureFull, FaTemperatureQuarter } from "react-icons/fa6";

import React, { useEffect, useRef, useState } from 'react';
const Api_key = "5f8adec2782a8d7d81468b12453e2843";

function App() {
  const inputRef = useRef(null);
  const [apiData, setApiData] = useState(null);
  const [showWeather, setShowWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bgColor, setBgColor] = useState('');
  const [searchColor, setSearchColor] = useState('');
  const [cityColor, setCityColor] = useState('');
  const [isCelsius, setIsCelsius] = useState(true);
  const [shortcutCities] = useState(["Mumbai", "Delhi", "Assam", "Hyderabad", "Pune"]);
  const [selectedCity, setSelectedCity] = useState();


  const weatherTypes = [
    {
      type: "Clear",
      img: "https://cdn-icons-png.flaticon.com/512/6974/6974833.png"
    },
    {
      type: "Rain",
      img: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png"
    },
    {
      type: "Snow",
      img: "https://cdn-icons-png.flaticon.com/512/642/642102.png"
    },
    {
      type: "Clouds",
      img: "https://cdn-icons-png.flaticon.com/512/414/414825.png"
    },
    {
      type: "Haze",
      img: "https://cdn-icons-png.flaticon.com/512/6974/6974833.png"
    },
    {
      type: "Smoke",
      img: "https://cdn-icons-png.flaticon.com/512/4380/4380458.png"
    },
    {
      type: "Mist",
      img: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png"
    },
    {
      type: "Drizzle",
      img: "https://cdn-icons-png.flaticon.com/512/3076/3076129.png"
    },

  ]

  const fetchWeatherByCity = async (city) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_key}`;

    try {
      setLoading(true);
      const response = await fetch(URL);
      const data = await response.json();
      setLoading(false);
      setApiData(data);
      console.log(data);

      const weatherType = data.weather[0].main;
      const selectedWeather = weatherTypes.find((weather) => weather.type === weatherType);
      setError(null);
      setShowWeather([selectedWeather]);
      setSelectedCity(city);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setError("Error fetching data");
    }
  };

  const handleClickCity = (city) => {

    fetchWeatherByCity(city);

  }



  const getBgColor = (temperature) => {
    if (temperature <= 0) return 'from-blue-500 to-blue-300';
    else if (temperature <= 25) return 'from-blue-900 to-blue-500';
    else if (temperature <= 35) return 'from-orange-500 to-orange-100';
    else if (temperature <= 100) return 'from-red-500 to-red-100';
    else return "from-blue-300 to-blue-100"
  };

  const getSearchColor = (temperature) => {
    if (temperature <= 0) return 'text-blue-500';
    else if (temperature <= 25) return 'text-blue-900';
    else if (temperature <= 35) return 'text-orange-500';
    else if (temperature <= 100) return 'text-red-500';
    else return "text-gray-800"
  }

  const getCityColor = (temperature) => {
    if (temperature <= 0) return 'text-blue-400';
    else if (temperature <= 25) return 'text-blue-800';
    else if (temperature <= 35) return 'text-orange-400';
    else if (temperature <= 100) return 'text-red-400';
    else return "text-gray-800"
  }

  useEffect(() => {

    setCityColor(getCityColor(Math.round(apiData?.main?.temp - 273.15)))
  }, [apiData]);


  useEffect(() => {
    setBgColor(getBgColor(Math.round(apiData?.main?.temp - 273.15)))
  }, [apiData]);


  useEffect(() => {
    setSearchColor(getSearchColor(Math.round(apiData?.main?.temp - 273.15)))
  }, [apiData]);

  useEffect(() => {
    setSelectedCity(null);

  }, [apiData]);

  const fetchWeather = async () => {

    if (!inputRef.current.value) {

      setError("Please enter a valid location");
      setShowWeather(null); // Clear showWeather state
      return;
    }

    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${inputRef.current.value}&appid=${Api_key}`;
    setLoading(true);
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        setApiData(null);
        setShowWeather(
          weatherTypes.filter((weather) => weather.type === data.weather[0].main)
        );
        console.log(data);
        setLoading(false);
        setApiData(data);
        setError(null);
      })
      .catch((err) => {
        setLoading(false);
        setShowWeather(null);
        setError("Enter a valid location.");

        console.log(err);
      });
  };

  const getTemperatureIcon = (temperature) => {
    if (temperature <= 0) return <FaTemperatureEmpty className="size-7 text-blue-400 mt-1" />
    else if (temperature <= 25) return <FaTemperatureQuarter className="size-7 text-blue-600 mt-1" />
    else if (temperature <= 50) return <FaTemperatureThreeQuarters className="size-7 text-orange-400 mt-1" />
    else return <FaTemperatureFull className="size-7 text-red-700 mt-1" />
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchWeather();
    }
  };

  const handleTemperatureConversion = () => {
    setIsCelsius((prev) => !prev);
  };

  const convertToCelsius = (tempInKelvin) => {
    return Math.round(tempInKelvin - 273.15);
  };

  const convertToFahrenheit = (tempInKelvin) => {
    return Math.round((tempInKelvin - 273.15) * 1.8 + 32);
  }


  return (


    <div
      className={`bg-gradient-to-b ${bgColor} place-items-center grid h-screen`}>
      <div
        className='bg-white w-96 p-3 rounded-md shadow-xl hover:scale-105 duration-150 h-fit'

      >

        <div
          className="flex items-center justify-between">

          <input
            type="text"
            ref={inputRef}
            placeholder='Enter Location' className='text-xl p-1 font-semibold uppercase outline-none font-abc'
            onKeyDown={handleKeyDown} />
          <button
            onClick={fetchWeather}
            className={`text-3xl ${searchColor} hover:scale-125 duration-200`}>
            <IoMdSearch />
          </button>

        </div>
        <div className="flex justify-center items-center">
          <ul className={`flex justify-center gap-4 mt-5 text-sm font-abc ${cityColor} font-bold`}>
            {shortcutCities.map((city) =>
              <li key={city} className={`cursor-pointer p-1 ${selectedCity === city || (apiData && apiData.name === city) ? 'border text-white border-gray-300 bg-black rounded-md' : ''}`}>
                <button

                  onClick={() => handleClickCity(city)}>
                  {city}
                </button>
              </li>
            )}
          </ul>

        </div>
        <div>
          {error && <div className="text-red-500 flex justify-center"><IoWarningOutline className="h-6 mr-1" />
            {error}</div>}
          {
            loading ? (
              <div
                className="flex items-center justify-center h-[469px]"
              >
                <img src="https://cdn.dribbble.com/users/2973561/screenshots/5757826/loading__.gif" alt=""
                  className="justify-center"
                />
              </div>
            ) : (
              showWeather && (
                <div
                  className="text-center flex flex-col gap-6 mt-10">
                  {
                    apiData &&
                    <p
                      className="text-2xl font-semibold">
                      {apiData?.name + (apiData.sys.country ? `, ` + apiData.sys.country : "")}
                    </p>
                  }
                  <img
                    src={showWeather[0]?.img} alt="..."
                    className="w-52 mx-auto" />
                  {
                    apiData &&
                    <>
                      <h3
                        className="text-2xl font-medium text-zinc-700 mb-3 font-bcd capitalize">
                        {apiData.weather[0].description}
                      </h3>

                      <div
                        className="justify-center items-center flex">
                        {
                          getTemperatureIcon(Math.round(apiData.main.temp - 273.15))
                        }

                        <h2 className="font-bold text-4xl p-3">
                          {apiData?.main?.temp && `${isCelsius ? convertToCelsius(apiData.main.temp) : convertToFahrenheit(apiData.main.temp)} `}
                          <button
                            className="border border-black p-1 rounded-md"
                            onClick={handleTemperatureConversion}
                          >
                            {isCelsius ? ' °C' : ' °F'}
                          </button>
                        </h2>



                      </div>
                    </>
                  }

                </div>
              )
            )
          }
        </div>
      </div>
    </div>
  );

};

export default App;


