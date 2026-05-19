import React from 'react'

import Image from 'next/image'

const page = () => {
  return (
    <div className='flex felx-row justify-center min-h-[80vh] m-[1vh] items-top items-top bg-[#bbb891]'>
      <div className='bg-[#bbb891] width-full p-[1vw] h-full'>
        <p>
          West-MEC's 2-year Advanced Manufacturing program offers a comprehensive curriculum covering 14 key standards. The program begins with an exploration of new technologies like AI, machine learning, and robotic process automation, and their impact on manufacturing. It then progresses through essential skills in electrical systems, hydraulics, pneumatics, and programmable logic controllers. Students also learn about industrial robotics, data communication methodologies, sensor applications, and various manufacturing processes.
          <br />
          Throughout the course, students gain hands-on experience with industry-standard equipment from companies like Festo, Universal Robots, and KUKA. They work with advanced systems such as the Festo MecLab, AC/DC Trainers, Hydraulics & Pneumatics Training Systems, and PLC Training Systems. The program also incorporates the use of Universal Robots, KUKA Ready2Educate Cells, and Festo Modular Production Systems with Industry 4.0 capabilities.
          <br />
          A unique feature of this program is the inclusion of cleanroom simulation training, preparing students for work in semiconductor and pharmaceutical industries. Completers of this program have the opportunity to earn valuable industry certifications such as NC3 (at various levels), Universal Robots certification, and KUKA CORE certification. These certifications, combined with the comprehensive skill set developed throughout the program, equip completers with the knowledge and practical experience needed to excel in the rapidly evolving field of advanced manufacturing and automation.
          <br />
          West-MEC's 2-year Advanced Manufacturing program offers a comprehensive curriculum covering 14 key standards. The program begins with an exploration of new technologies like AI, machine learning, and robotic process automation, and their impact on manufacturing. It then progresses through essential skills in electrical systems, hydraulics, pneumatics, and programmable logic controllers. Students also learn about industrial robotics, data communication methodologies, sensor applications, and various manufacturing processes.
        </p>
      </div>
      <div className='bg-[#bbb891] width-full p-[1vw] h-full flex flex-col'>

        <Image className='w-full' src='https://res.cloudinary.com/dzu7xnmgw/image/upload/v1779226232/DSC03342_xk9bib.webp' alt={''} height={200} width={200} ></Image>

        <p>
          
          Throughout the course, students gain hands-on experience with industry-standard equipment from companies like Festo, Universal Robots, and KUKA. They work with advanced systems such as the Festo MecLab, AC/DC Trainers, Hydraulics & Pneumatics Training Systems, and PLC Training Systems. The program also incorporates the use of Universal Robots, KUKA Ready2Educate Cells, and Festo Modular Production Systems with Industry 4.0 capabilities.

        </p>


      </div>
    </div>
  )
}

export default page