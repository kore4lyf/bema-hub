import { bemaHubLogoHorizontal } from "@/assets/images/images";
import Image from "next/image";


const Logo = ({ size, theme }: { size: string, theme?: "system" | "light" | "dark"  }) => {
  const imageProp = {
    width: parseFloat(size),
    height: (parseFloat(size) * 60) / 100
  }

  

  return (
    <div>
      <Image className={theme === "light" ? "" :
        theme === "dark" ? "invert-100" : "invert-100 dark:invert-0"} 
        draggable="false"
        alt="Bema hub's offical Logo" src={bemaHubLogoHorizontal} {...imageProp} />
    </div>
  )
}

export default Logo
