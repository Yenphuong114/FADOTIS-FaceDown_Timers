import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Vibration } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';


const { width } = Dimensions.get('window');

// --- CÔNG THỨC TOÁN HỌC CHIA KHOẢNG CÁCH ---
const PADDING_HORIZONTAL = 30; // Khoảng cách lề 2 bên để icon không chạm viền
const TAB_WIDTH = (width - PADDING_HORIZONTAL * 2) / 4; // Chia đều không gian còn lại cho 4 icon
const MASK_SIZE = 90; // Kích thước lỗ khoét (to hơn để không chạm icon)

// --- KHAI BÁO 4 ICON SVG CỦA BẠN (Giữ nguyên) ---
const SvgTomato = () => (
  <Svg width="100%" height="100%" viewBox="0 0 50 50" fill="none">
    <Path d="M24.9997 4.6875C27.3851 6.64583 27.9372 10.0385 24.9997 11.7396C22.0622 10.0385 22.6143 6.64583 24.9997 4.6875ZM30.6789 12.6917C30.7424 15.0833 27.4518 16.3344 24.9997 15.7615C22.5476 16.3344 19.257 15.0844 19.3205 12.6917C21.2705 11.2906 23.7153 12.449 24.9997 15.0073C26.2841 12.449 28.7289 11.2906 30.6789 12.6917ZM22.3695 18.1906C20.5664 17.4906 19.282 16.6 18.0862 16.6104C2.24241 16.75 3.83616 45.3125 24.9997 45.3125C46.1632 45.3125 47.758 16.75 31.9143 16.6104C30.7101 16.6 29.431 17.4854 27.6299 18.1906C25.8257 18.8979 24.2893 18.9354 22.3695 18.1906Z" fill="black" stroke="black" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SvgLeaderboard = () => (
  <Svg width="100%" height="100%" viewBox="0 0 50 50" fill="none">
    <Path d="M1.70801 19.4795C1.70801 21.0542 2.33356 22.5644 3.44706 23.6779C4.56056 24.7914 6.07079 25.417 7.64551 25.417C9.22023 25.417 10.7305 24.7914 11.844 23.6779C12.9575 22.5644 13.583 21.0542 13.583 19.4795C13.583 17.9048 12.9575 16.3945 11.844 15.281C10.7305 14.1675 9.22023 13.542 7.64551 13.542C6.07079 13.542 4.56056 14.1675 3.44706 15.281C2.33356 16.3945 1.70801 17.9048 1.70801 19.4795Z" fill="black"/>
    <Path d="M1.1046 30.7288H14.1879C14.3827 30.7269 14.5731 30.6714 14.7384 30.5685C14.9037 30.4656 15.0376 30.3193 15.1254 30.1455C15.2107 29.9671 15.2423 29.7678 15.2164 29.5718C15.1905 29.3758 15.1082 29.1915 14.9796 29.0413C14.1043 27.9368 12.9892 27.0457 11.7187 26.4358C10.4482 25.8258 9.0556 25.5128 7.64627 25.5205C6.23797 25.5189 4.84739 25.8346 3.57783 26.4441C2.30827 27.0536 1.19234 27.9414 0.312937 29.0413C0.184313 29.1915 0.102061 29.3758 0.0761723 29.5718C0.050284 29.7678 0.0818734 29.9671 0.167103 30.1455C0.254911 30.3193 0.388794 30.4656 0.554128 30.5685C0.719461 30.6714 0.909887 30.7269 1.1046 30.7288ZM25.2504 14.583C26.4203 14.5828 27.564 14.2371 28.5381 13.5891C29.5121 12.9412 30.273 12.02 30.7253 10.9411C31.1776 9.86222 31.3011 8.67377 31.0803 7.52494C30.8595 6.37611 30.3043 5.3181 29.4843 4.48373C28.6643 3.64936 27.6161 3.07581 26.4713 2.83508C25.3265 2.59435 24.1361 2.69717 23.0495 3.13064C21.9629 3.5641 21.0286 4.30889 20.3638 5.27151C19.6991 6.23413 19.3335 7.37167 19.3129 8.54134C19.3019 9.32904 19.4472 10.1111 19.7404 10.8423C20.0336 11.5735 20.4689 12.2392 21.021 12.8011C21.5732 13.363 22.2313 13.8097 22.9573 14.1156C23.6833 14.4215 24.4627 14.5803 25.2504 14.583ZM17.6463 20.3122H32.8338C33.029 20.3126 33.2204 20.2581 33.3862 20.1549C33.5519 20.0518 33.6854 19.9042 33.7713 19.7288C33.8593 19.5524 33.8944 19.3542 33.8722 19.1583C33.85 18.9623 33.7715 18.777 33.6463 18.6247C32.6452 17.3752 31.3773 16.3655 29.9353 15.6698C28.4934 14.974 26.914 14.6098 25.3129 14.6038C23.7119 14.6098 22.1325 14.974 20.6906 15.6698C19.2486 16.3655 17.9806 17.3752 16.9796 18.6247C16.8273 18.7595 16.7169 18.9352 16.6615 19.1309C16.6061 19.3267 16.608 19.5342 16.6671 19.7288C16.756 19.9107 16.8959 20.0627 17.0698 20.1663C17.2437 20.2699 17.444 20.3206 17.6463 20.3122ZM36.4171 19.4788C36.4171 21.0536 37.0427 22.5638 38.1562 23.6773C39.2696 24.7908 40.7799 25.4163 42.3546 25.4163C43.9293 25.4163 45.4395 24.7908 46.553 23.6773C47.6665 22.5638 48.2921 21.0536 48.2921 19.4788C48.2921 17.9041 47.6665 16.3939 46.553 15.2804C45.4395 14.1669 43.9293 13.5413 42.3546 13.5413C40.7799 13.5413 39.2696 14.1669 38.1562 15.2804C37.0427 16.3939 36.4171 17.9041 36.4171 19.4788Z" fill="black"/>
    <Path d="M35.833 30.7289H48.8955C49.0907 30.7293 49.2821 30.6748 49.4479 30.5717C49.6136 30.4685 49.7471 30.3209 49.833 30.1456C49.9161 29.9679 49.9484 29.7707 49.9263 29.5758C49.9043 29.3809 49.8287 29.196 49.708 29.0414C48.8264 27.9387 47.7071 27.0493 46.4337 26.4396C45.1603 25.83 43.7656 25.5158 42.3538 25.5206C40.9458 25.5204 39.5557 25.8368 38.2864 26.4462C37.017 27.0556 35.9009 27.9425 35.0205 29.0414C34.8952 29.1937 34.8167 29.379 34.7946 29.575C34.7724 29.7709 34.8074 29.9691 34.8955 30.1456C34.9814 30.3209 35.1148 30.4685 35.2806 30.5717C35.4463 30.6748 35.6377 30.7293 35.833 30.7289Z" fill="black"/>
    <Path d="M47.9167 33.8542H34.375C34.0987 33.8542 33.8338 33.7444 33.6384 33.5491C33.4431 33.3537 33.3333 33.0888 33.3333 32.8125V25.5208C33.3333 24.9683 33.1138 24.4384 32.7231 24.0477C32.3324 23.657 31.8025 23.4375 31.25 23.4375H18.75C18.1975 23.4375 17.6676 23.657 17.2769 24.0477C16.8862 24.4384 16.6667 24.9683 16.6667 25.5208V32.8125C16.6667 33.0888 16.5569 33.3537 16.3616 33.5491C16.1662 33.7444 15.9013 33.8542 15.625 33.8542H2.08333C1.5308 33.8542 1.0009 34.0737 0.610194 34.4644C0.219493 34.8551 0 35.385 0 35.9375L0 45.3125C0 45.865 0.219493 46.3949 0.610194 46.7856C1.0009 47.1763 1.5308 47.3958 2.08333 47.3958H47.9167C48.4692 47.3958 48.9991 47.1763 49.3898 46.7856C49.7805 46.3949 50 45.865 50 45.3125V35.9375C50 35.385 49.7805 34.8551 49.3898 34.4644C48.9991 34.0737 48.4692 33.8542 47.9167 33.8542Z" fill="black"/>
  </Svg>
);

const SvgCalendar = () => (
  <Svg width="100%" height="100%" viewBox="0 0 50 50" fill="none">
    <Path d="M3.125 44.5312C3.125 45.1529 3.37193 45.749 3.81147 46.1885C4.25101 46.6281 4.84715 46.875 5.46875 46.875H44.5312C45.1529 46.875 45.749 46.6281 46.1885 46.1885C46.6281 45.749 46.875 45.1529 46.875 44.5312V17.1875H3.125V44.5312ZM34.375 20.7031C34.375 20.5995 34.4162 20.5002 34.4894 20.4269C34.5627 20.3537 34.662 20.3125 34.7656 20.3125H38.6719C38.7755 20.3125 38.8748 20.3537 38.9481 20.4269C39.0213 20.5002 39.0625 20.5995 39.0625 20.7031V24.6094C39.0625 24.713 39.0213 24.8123 38.9481 24.8856C38.8748 24.9588 38.7755 25 38.6719 25H34.7656C34.662 25 34.5627 24.9588 34.4894 24.8856C34.4162 24.8123 34.375 24.713 34.375 24.6094V20.7031ZM34.375 28.5156C34.375 28.412 34.4162 28.3127 34.4894 28.2394C34.5627 28.1662 34.662 28.125 34.7656 28.125H38.6719C38.7755 28.125 38.8748 28.1662 38.9481 28.2394C39.0213 28.3127 39.0625 28.412 39.0625 28.5156V32.4219C39.0625 32.5255 39.0213 32.6248 38.9481 32.6981C38.8748 32.7713 38.7755 32.8125 38.6719 32.8125H34.7656C34.662 32.8125 34.5627 32.7713 34.4894 32.6981C34.4162 32.6248 34.375 32.5255 34.375 32.4219V28.5156ZM26.5625 20.7031C26.5625 20.5995 26.6037 20.5002 26.6769 20.4269C26.7502 20.3537 26.8495 20.3125 26.9531 20.3125H30.8594C30.963 20.3125 31.0623 20.3537 31.1356 20.4269C31.2088 20.5002 31.25 20.5995 31.25 20.7031V24.6094C31.25 24.713 31.2088 24.8123 31.1356 24.8856C31.0623 24.9588 30.963 25 30.8594 25H26.9531C26.8495 25 26.7502 24.9588 26.6769 24.8856C26.6037 24.8123 26.5625 24.713 26.5625 24.6094V20.7031ZM26.5625 28.5156C26.5625 28.412 26.6037 28.3127 26.6769 28.2394C26.7502 28.1662 26.8495 28.125 26.9531 28.125H30.8594C30.963 28.125 31.0623 28.1662 31.1356 28.2394C31.2088 28.3127 31.25 28.412 31.25 28.5156V32.4219C31.25 32.5255 31.2088 32.6248 31.1356 32.6981C31.0623 32.7713 30.963 32.8125 30.8594 32.8125H26.9531C26.8495 32.8125 26.7502 32.7713 26.6769 32.6981C26.6037 32.6248 26.5625 32.5255 26.5625 32.4219V28.5156ZM26.5625 36.3281C26.5625 36.2245 26.6037 36.1252 26.6769 36.0519C26.7502 35.9787 26.8495 35.9375 26.9531 35.9375H30.8594C30.963 35.9375 31.0623 35.9787 31.1356 36.0519C31.2088 36.1252 31.25 36.2245 31.25 36.3281V40.2344C31.25 40.338 31.2088 40.4373 31.1356 40.5106C31.0623 40.5838 30.963 40.625 30.8594 40.625H26.9531C26.8495 40.625 26.7502 40.5838 26.6769 40.5106C26.6037 40.4373 26.5625 40.338 26.5625 40.2344V36.3281ZM18.75 28.5156C18.75 28.412 18.7912 28.3127 18.8644 28.2394C18.9377 28.1662 19.037 28.125 19.1406 28.125H23.0469C23.1505 28.125 23.2498 28.1662 23.3231 28.2394C23.3963 28.3127 23.4375 28.412 23.4375 28.5156V32.4219C23.4375 32.5255 23.3963 32.6248 23.3231 32.6981C23.2498 32.7713 23.1505 32.8125 23.0469 32.8125H19.1406C19.037 32.8125 18.9377 32.7713 18.8644 32.6981C18.7912 32.6248 18.75 32.5255 18.75 32.4219V28.5156ZM18.75 36.3281C18.75 36.2245 18.7912 36.1252 18.8644 36.0519C18.9377 35.9787 19.037 35.9375 19.1406 35.9375H23.0469C23.1505 35.9375 23.2498 35.9787 23.3231 36.0519C23.3963 36.1252 23.4375 36.2245 23.4375 36.3281V40.2344C23.4375 40.338 23.3963 40.4373 23.3231 40.5106C23.2498 40.5838 23.1505 40.625 23.0469 40.625H19.1406C19.037 40.625 18.9377 40.5838 18.8644 40.5106C18.7912 40.4373 18.75 40.338 18.75 40.2344V36.3281ZM10.9375 28.5156C10.9375 28.412 10.9787 28.3127 11.0519 28.2394C11.1252 28.1662 11.2245 28.125 11.3281 28.125H15.2344C15.338 28.125 15.4373 28.1662 15.5106 28.2394C15.5838 28.3127 15.625 28.412 15.625 28.5156V32.4219C15.625 32.5255 15.5838 32.6248 15.5106 32.6981C15.4373 32.7713 15.338 32.8125 15.2344 32.8125H11.3281C11.2245 32.8125 11.1252 32.7713 11.0519 32.6981C10.9787 32.6248 10.9375 32.5255 10.9375 32.4219V28.5156ZM10.9375 36.3281C10.9375 36.2245 10.9787 36.1252 11.0519 36.0519C11.1252 35.9787 11.2245 35.9375 11.3281 35.9375H15.2344C15.338 35.9375 15.4373 35.9787 15.5106 36.0519C15.5838 36.1252 15.625 36.2245 15.625 36.3281V40.2344C15.625 40.338 15.5838 40.4373 15.5106 40.5106C15.4373 40.5838 15.338 40.625 15.2344 40.625H11.3281C11.2245 40.625 11.1252 40.5838 11.0519 40.5106C10.9787 40.4373 10.9375 40.338 10.9375 40.2344V36.3281ZM44.5312 6.25H39.0703V3.125H34.3828V6.25H15.6172V3.125H10.9297V6.25H5.46875C5.16214 6.24742 4.85804 6.30554 4.57399 6.42101C4.28994 6.53647 4.03154 6.707 3.81368 6.92277C3.59582 7.13854 3.42281 7.39529 3.30461 7.67822C3.18642 7.96114 3.12538 8.26466 3.125 8.57129V14.0625H46.875V8.57129C46.8746 8.26466 46.8136 7.96114 46.6954 7.67822C46.5772 7.39529 46.4042 7.13854 46.1863 6.92277C45.9685 6.707 45.7101 6.53647 45.426 6.42101C45.142 6.30554 44.8379 6.24742 44.5312 6.25Z" fill="black"/>
  </Svg>
);

const SvgUser = () => (
  <Svg width="100%" height="100%" viewBox="0 0 50 50" fill="none">
    <Path d="M25.0003 4.16699C13.5003 4.16699 4.16699 13.5003 4.16699 25.0003C4.16699 36.5003 13.5003 45.8337 25.0003 45.8337C36.5003 45.8337 45.8337 36.5003 45.8337 25.0003C45.8337 13.5003 36.5003 4.16699 25.0003 4.16699ZM25.0003 12.5003C29.0212 12.5003 32.292 15.7712 32.292 19.792C32.292 23.8128 29.0212 27.0837 25.0003 27.0837C20.9795 27.0837 17.7087 23.8128 17.7087 19.792C17.7087 15.7712 20.9795 12.5003 25.0003 12.5003ZM25.0003 41.667C20.7712 41.667 15.7712 39.9587 12.2087 35.667C15.8583 32.8049 20.3623 31.2495 25.0003 31.2495C29.6383 31.2495 34.1424 32.8049 37.792 35.667C34.2295 39.9587 29.2295 41.667 25.0003 41.667Z" fill="black"/>
  </Svg>
);

const TABS = [
  { id: 'tomato', component: <SvgTomato /> },
  { id: 'leaderboard', component: <SvgLeaderboard /> },
  { id: 'calendar', component: <SvgCalendar /> },
  { id: 'profile', component: <SvgUser /> },
];
 
export default function HomeScreen({ route, navigation }) {
  const [activeTab, setActiveTab] = useState(0); 
  const slideAnim = useRef(new Animated.Value(0)).current; 

  const [studyTime, setStudyTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [cycle, setCycle] = useState(4);
  const [isFlipEnabled, setIsFlipEnabled] = useState(true);  

  // === TỪ ĐÂY: KHỐI CODE MỚI CHO THỜI GIAN VÀ CẢM BIẾN ===
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const isFaceDownRef = useRef(false);

  const targetTimeRef = useRef(null);

  const [timerMode, setTimerMode] = useState('study'); // Có 3 trạng thái: 'study', 'shortBreak', 'longBreak'
  const [currentCycle, setCurrentCycle] = useState(1); // Đếm xem đang ở chu kỳ thứ mấy

  // BỘ PHẬN HỨNG DỮ LIỆU TỪ SET TIME GỬI VỀ
  useEffect(() => {
    if (route.params) {
      if (route.params.studyTime) {
        setStudyTime(route.params.studyTime); // Cập nhật số liệu hiển thị trong khung
        setTimeLeft(route.params.studyTime * 60); // Cập nhật đồng hồ đếm ngược to đùng
        setTotalTime(route.params.studyTime * 60);
        // Reset lại chu kỳ từ đầu khi có cài đặt mới
        setTimerMode('study'); 
        setCurrentCycle(1);

      }
      if (route.params.shortBreak) setShortBreak(route.params.shortBreak);
      if (route.params.longBreak) setLongBreak(route.params.longBreak);
      if (route.params.cycle) setCycle(route.params.cycle);
      if (route.params.isFlipEnabled !== undefined) setIsFlipEnabled(route.params.isFlipEnabled);
      
      setIsRunning(false); // Tạm dừng đồng hồ chờ người dùng bấm Play
    }
  }, [route.params]);

  // Xử lý đếm lùi thời gian
// 2. Logic trừ lùi thời gian & Tự động chuyển vòng
// 2. Logic trừ lùi thời gian & Tự động chuyển vòng (Phiên bản Bất Tử)
  useEffect(() => {
    let interval;
    // Chốt mốc thời gian NGAY LÚC NÀY
    let lastTick = Date.now(); 

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        const now = Date.now();
        // Tính xem thực tế đã qua bao nhiêu giây. 
        // Bình thường là 1s. Nếu thoát app 15 giây, nó sẽ tự lòi ra 15s!
        const passedSeconds = Math.round((now - lastTick) / 1000);
        lastTick = now; // Cập nhật mốc mới

        setTimeLeft((prev) => {
          const newTime = prev - passedSeconds;
          return newTime > 0 ? newTime : 0;
        });
      }, 1000);
      
    } else if (isRunning && timeLeft === 0) {
      // --- HẾT GIỜ! ---
      Vibration.vibrate([0, 500, 200, 500]);
      (async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' } 
          );
          await sound.playAsync();
        } catch (error) { console.log(error); }
      })();

      // --- LOGIC LUÂN CHUYỂN ---
      if (timerMode === 'study') {
        if (currentCycle < cycle) {
          setTimerMode('shortBreak');
          setTimeLeft(shortBreak * 60);
          setTotalTime(shortBreak * 60);
        } else {
          setTimerMode('longBreak');
          setTimeLeft(longBreak * 60);
          setTotalTime(longBreak * 60);
        }
      } 
      else if (timerMode === 'shortBreak') {
        setTimerMode('study');
        setCurrentCycle(prev => prev + 1);
        setTimeLeft(studyTime * 60);
        setTotalTime(studyTime * 60);
      } 
      else if (timerMode === 'longBreak') {
        setTimerMode('study');
        setCurrentCycle(1);
        setTimeLeft(studyTime * 60);
        setTotalTime(studyTime * 60);
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerMode, currentCycle, cycle, studyTime, shortBreak, longBreak]);


  // 3. ENGINE CHUYỂN CHU KỲ & BÁO THỨC (Khi đồng hồ chạm 0)
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      Vibration.vibrate([0, 500, 200, 500]);
      (async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' } 
          );
          await sound.playAsync();
        } catch (error) { console.log("Lỗi âm thanh:", error); }
      })();

      let nextTime = 0;
      let shouldRunNext = true; 

      if (timerMode === 'study') {
        if (currentCycle < cycle) {
          setTimerMode('shortBreak');
          nextTime = shortBreak * 60;
        } else {
          setTimerMode('longBreak');
          nextTime = longBreak * 60;
        }
      } 
      else if (timerMode === 'shortBreak') {
        setTimerMode('study');
        setCurrentCycle(prev => prev + 1);
        nextTime = studyTime * 60;
        shouldRunNext = false; // Nghỉ ngắn xong dừng lại chờ úp máy
      } 
      else if (timerMode === 'longBreak') {
        setTimerMode('study');
        setCurrentCycle(1);
        nextTime = studyTime * 60;
        shouldRunNext = false; // Nghỉ dài xong dừng lại chờ úp máy
      }

      setTimeLeft(nextTime);
      setTotalTime(nextTime);
      setIsRunning(shouldRunNext); 
    }
  }, [timeLeft, isRunning]);

// Xử lý cảm biến lật/úp điện thoại (Độc quyền: Chỉ dùng úp máy để chạy)
// Xử lý cảm biến lật/úp điện thoại (Đã nâng cấp: Nghỉ ngơi được lật máy tự do)
// 4. CẢM BIẾN LẬT ÚP ĐIỆN THOẠI (Đồng bộ trực tiếp theo trạng thái chạy)
  useEffect(() => {
    Accelerometer.setUpdateInterval(500); 
    const subscription = Accelerometer.addListener(({ z }) => {
      const isCurrentlyFaceDown = z < -0.85;

      // CHỈ phạt hoặc kích hoạt khi đang trong chế độ HỌC (study)
      if (timerMode === 'study') {
        if (isCurrentlyFaceDown) {
          // Nếu máy đang úp mà đồng hồ đang đứng yên -> Kích hoạt chạy
          if (!isRunning) setIsRunning(true); 
        } else {
          // Nếu máy đang ngửa mà đồng hồ đang chạy -> Lập tức dừng và reset
          if (isRunning) {
            setIsRunning(false); 
            setTimeLeft(studyTime * 60); 
          }
        }
      }
    });
    
    return () => subscription.remove();
  }, [studyTime, timerMode, isRunning]); 

  // Tính toán chữ hiển thị trên thẻ
  let modeTitle = "Học tập";
  if (timerMode === 'shortBreak') modeTitle = "Nghỉ ngắn";
  if (timerMode === 'longBreak') modeTitle = "Nghỉ dài";

  let currentModeTime = studyTime;
  if (timerMode === 'shortBreak') currentModeTime = shortBreak;
  if (timerMode === 'longBreak') currentModeTime = longBreak;  
  

  const handleTabPress = (index) => {
    if (index === activeTab) return;
    
    // Ép icon nảy lên ngay lập tức không cần chờ đợi
    setActiveTab(index); 

    // Dùng 'timing' thay cho 'spring' để tốc độ cực nhanh
    Animated.timing(slideAnim, {
      toValue: index,
      duration: 150, // Thời gian trượt siêu nhanh (150 mili-giây)
      useNativeDriver: true, 
    }).start(() => {
      if (index === 1) navigation.navigate('Leaderboard');
      if (index === 2) navigation.navigate('Calendar');
      if (index === 3) navigation.navigate('Profile');
    });
  };  

  // Tính tọa độ X cho vết khoét màu trắng trượt ngang
  // (Khoảng cách lề) + (Vị trí của icon thứ index) + (Nửa chiều rộng icon) - (Nửa kích thước vết khoét)
  const maskTranslateX = slideAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      PADDING_HORIZONTAL + (TAB_WIDTH * 0) + (TAB_WIDTH / 2) - (MASK_SIZE / 2),
      PADDING_HORIZONTAL + (TAB_WIDTH * 1) + (TAB_WIDTH / 2) - (MASK_SIZE / 2),
      PADDING_HORIZONTAL + (TAB_WIDTH * 2) + (TAB_WIDTH / 2) - (MASK_SIZE / 2),
      PADDING_HORIZONTAL + (TAB_WIDTH * 3) + (TAB_WIDTH / 2) - (MASK_SIZE / 2),
    ]
  });

  const size = 300;
  const strokeWidth = 25;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

// === XÓA ĐOẠN TÍNH TOÁN CŨ, THAY BẰNG ĐOẠN MỚI NÀY ===
  const progressPercent = timeLeft / (studyTime * 60);
  const strokeDashoffset = circumference - (circumference * progressPercent);

  const minutesDisplay = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secondsDisplay = (timeLeft % 60).toString().padStart(2, '0');
  // === ĐẾN ĐÂY ===

  return (
    <View style={styles.container}>
      
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pomodoro Timer</Text>
      </View>
      <View style={styles.divider} />

      {/* 2. TASK CARD */}
      <View style={styles.taskCard}>
        <View style={styles.taskIconBox}>
          <FontAwesome5 name="book" size={20} color="white" />
        </View>
        <View style={styles.taskInfoLeft}>
          <Text style={styles.taskTitle}>{modeTitle}</Text>
          <Text style={styles.taskSubtitle}>{currentModeTime} minutes</Text>
        </View>
        <View style={styles.taskInfoRight}>
          <Text style={styles.taskTitle}>{currentCycle}/{cycle}</Text>
          <Text style={styles.taskSubtitle}>Chu kỳ</Text>
        </View>
      </View>

      {/* 3. TIMER */}
      <View style={styles.timerContainer}>
        <Svg width={size} height={size}>
          <Circle stroke="#67BDB7" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
          <Circle 
            stroke="#469E6F" 
            fill="none" 
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            strokeWidth={strokeWidth} 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset}  
            strokeLinecap="round" 
            transform={`rotate(-90 ${size / 2} ${size / 2})`} 
          />
        </Svg>
        <View style={styles.timeTextContainer}>
          <Text style={styles.timeText}>{minutesDisplay}:{secondsDisplay}</Text>
          <TouchableOpacity 
            style={styles.setTimeButton}
            onPress={() => navigation.navigate('SetTime', { studyTime, shortBreak, longBreak, cycle, isFlipEnabled })}
          >
            <Text style={styles.setTimeText}>Set Time</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.instructionText}>
        Hãy úp điện thoại xuống để bắt đầu học
      </Text>

    {/* <TouchableOpacity 
        style={styles.pauseButton}
        onPress={() => setIsRunning(!isRunning)}
      >
        <Ionicons 
          name={isRunning ? "pause" : "play"} 
          size={40} 
          color="#67BDB7" 
          style={{ marginLeft: isRunning ? 0 : 5 }} 
        />
      </TouchableOpacity>
      */} 

      {/* 5. BOTTOM NAVIGATION BAR - BẢN ĐÃ CĂN CHỈNH */}
      <View style={styles.bottomBarWrapper}>
        
        <View style={styles.bottomBar} />

        {/* Lỗ khoét dùng Vector */}
        <Animated.View style={[
          styles.cutoutMask, 
          { transform: [{ translateX: maskTranslateX }] } 
        ]}>
          <Svg width={110} height={60} viewBox="0 0 110 60">
            <Path 
              d="M 0 20 C 25 20, 35 60, 55 60 C 75 60, 85 20, 110 20 L 110 0 L 0 0 Z" 
              fill="#fff" 
            />
          </Svg>
        </Animated.View>

        {/* Container chứa 4 icon có khoảng trống 2 bên */}
        <View style={styles.iconsContainer}>
          {TABS.map((tab, index) => {
            const isActive = activeTab === index;
            
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabItem}
                onPress={() => handleTabPress(index)}
                activeOpacity={1} 
              >
                <Animated.View style={[
                  styles.iconWrapper,
                  { 
                    transform: [
                      { translateY: isActive ? -45 : 0 },
                      { scale: isActive ? 1.2 : 0.75 } 
                    ]
                  }
                ]}>
                  {tab.component}
                </Animated.View>
              </TouchableOpacity>
            )
          })}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 15 },
  headerTitle: { fontSize: 25, fontWeight: '900', color: '#2A3B38' },
  divider: { height: 1, backgroundColor: '#E0E0E0', width: '100%', marginBottom: 30 },
  taskCard: { flexDirection: 'row', backgroundColor: '#F0F0F0', marginHorizontal: 10, padding: 1, borderRadius: 15, alignItems: 'center',width: '65%', alignSelf: 'flex-end', elevation: 2, shadowColor: '#000',shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,},
  taskIconBox: { backgroundColor: '#000', padding: 12, borderRadius: 10, borderWidth: 2, borderColor: '#469E6F' },
  taskInfoLeft: { flex: 2, marginLeft: 15 },
  taskInfoRight: { alignItems: 'flex-end', paddingRight: 10 },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3B38' },
  taskSubtitle: { fontSize: 13, color: '#67BDB7', fontWeight: '600', marginTop: 2 },
  timerContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  timeTextContainer: { position: 'absolute', alignItems: 'center', zIndex: 10, elevation: 10 },
  timeText: { fontSize: 65, fontWeight: '900', color: '#67BDB7', letterSpacing: 2 },
  setTimeButton: { backgroundColor: '#BEE3E0', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 10, marginTop: -5 },
  setTimeText: { color: '#529692', fontWeight: 'bold', fontSize: 16 },
  instructionText: { fontSize: 16, color: '#67BDB7', fontWeight: 'bold', textAlign: 'center', marginTop: 40 },
  pauseButton: { alignSelf: 'center', backgroundColor: '#F2D1CE', width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#469E6F', marginTop: 60 },
  
  // --- CSS BOTTOM BAR ---
  bottomBarWrapper: { 
    position: 'absolute', bottom: 0, width: '100%', height: 100 
  },
  bottomBar: { 
    position: 'absolute', bottom: 0, width: '100%', height: 70, 
    backgroundColor: '#F2D1CE', 
    borderTopLeftRadius: 30, borderTopRightRadius: 30 
  },
  cutoutMask: {
    position: 'absolute',
    bottom: 35, // Hạ thấp xuống một xíu để đào sâu hơn
    left: 0, 
    width: MASK_SIZE,  // 90px (rộng rãi hơn)
    height: MASK_SIZE, // 90px (cao hơn)
    borderRadius: MASK_SIZE / 2, // 45px 
    backgroundColor: '#fff', 
    zIndex: 1,
  },
  iconsContainer: {
    position: 'absolute', bottom: 0, width: '100%', height: 70, 
    flexDirection: 'row', 
    paddingHorizontal: PADDING_HORIZONTAL, // Thêm khoảng lề trái phải (20px)
    zIndex: 2, 
  },
  tabItem: {
    flex: 1, // Chia đều không gian để các khoảng cách chính xác bằng nhau
    justifyContent: 'center', 
    alignItems: 'center',
  },
  iconWrapper: {
    width: 45, 
    height: 45, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
});