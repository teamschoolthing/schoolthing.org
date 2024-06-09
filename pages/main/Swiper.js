import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from 'swiper';
import {MoreHorizontalFill} from "akar-icons"
// Import Swiper styles
import "swiper/css";

export default function Swp() {
  var size = "100%";
  SwiperCore.use([Autoplay]);
  return (
    <>
    <Swiper
      spaceBetween={2}
      slidesPerView={1}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      autoplay={{ delay: 15000 }}
      
      style={{borderRadius: '15px',boxShadow: '0 0 5px 5px #e5e5e5' }}
    >
      <SwiperSlide>
        <img src="/s2.png" onClick={()=>{window.location.href="/global"}} width={size} height={size}/>
      </SwiperSlide>
      <SwiperSlide>
        <img src="/s1.png" onClick={()=>{window.location.href="mailto:support@pidgon.com"}} width={size} height={size} />
      </SwiperSlide>
    </Swiper>
    <div style={{margin: '-5px 40vw'}}><MoreHorizontalFill size={36} color="lightgrey" /></div>
    </>
  );
}
