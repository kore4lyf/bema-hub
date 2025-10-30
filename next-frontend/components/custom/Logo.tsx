import { bemaHubLogoHorizontal } from "@/assets/images/images";
import Image from "next/image";


const Logo = ({ size }: { size: string }) => {
  const imageProp = {
    width: parseFloat(size),
    height: (parseFloat(size) * 60) / 100
  }

  return (
    <div>
      <Image className="invert-100 dark:invert-0" 
      draggable="false"
      alt="Bema hub's offical Logo" src={bemaHubLogoHorizontal} {...imageProp} />
    </div>
  )
}

export default Logo
