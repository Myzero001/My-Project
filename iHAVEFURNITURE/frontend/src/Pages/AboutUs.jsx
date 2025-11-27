import React from 'react'

function AboutUs() {
  return (
    <div>
      <div className="container">
        <div className="card mt-5 ps-3">
          <div className="card-body">
            <h2>ที่มาและความสำคัญ</h2>
            <p style={{ textIndent: '3em' }} className='mt-4'>
              IHAVEFurniture ถูกสร้างขึ้นเพื่อจำลองเว็บไซต์ในรูปแบบของ E-commerce โดยมีเป้าหมายเพื่อสึกษาวิธีการสร้างสรรค์ และวิธีดำเนินงานของการสร้างเว็บไซต์
              เพื่อจำหน่ายสินค้าออนไลน์ อันเป็นประโยชน์ต่อการประกอบอาชีพในสายงานวิศวกรรมคอมพิวเตอร์ในอนาคตของนักศึกษา
            </p>
            <p style={{ textIndent: '3em' }}>
              ทีมของพวกเราทำการแบ่งการทำงานอย่างสัดส่วนอย่างชัดเจน ตั้งแต่ผู้ออกแบบ และวิเคราะห์ระบบ, ผู้ออกแบบ Userinterface และ UserExperience, FrontEnd,
              BackEnd และ Tester โดยแบ่งตามความถนัดของสมาชิกภายในกลุ่ม
            </p>
            <p>เพื่อเป้าหมายในการศึกษาวิธีการทำงานที่สมาชิกแต่ละคนนั้นสนใจได้อย่างชัดเจน และจะทำการแบ่งปันความรู้ที่ได้แยกกันศึกษาในช่วงท้ายของการทำโครงการ</p>
          </div>
        </div>
        <div className="card mt-4">
          <div className="card-body">
            <h1 className='text-center mt-3 mb-5'>ทีมของเรา</h1>

            <div className="row">

              <div className="col-4">
                <div className="my-team">
                  <img className="img-fluid" src="/image/Other/palm.jpg" alt="" />
                </div>
                <h2 className="text-center mt-3">Front-End Developer</h2>
                <h2 className="text-center">(Admin & Customer)</h2>
                <hr />
                <p className="text-center mt-2">วฤณ พรหมวรานนท์</p>
                <p className="text-center">65112274</p>
              </div>


              <div className="col-4">
                <div className="my-team">
                  <img className="img-fluid" src="/image/Other/por.jpg" alt="" />
                </div>
                <h2 className="text-center mt-3">Project Manager</h2>
                <h2 className="text-center">Back-End Developer</h2>
                <h2 className="text-center">(Admin & Customer)</h2>
                <hr />
                <p className='text-center'>เวงซัว แต</p>
                <p className='text-center'>65111809</p>

              </div>

              <div className="col-4">
                <div className="my-team">
                  <img className="img-fluid" src="/image/Other/jom.jpg" alt="" />
                </div>
                <h2 className="text-center mt-3">UX &  UI Designer</h2>
                <h2 className="text-center ">Graphic Designer</h2>
                <hr />
                <p className='text-center'>จอมปราชญ์ ร้กโลก</p>
                <p className='text-center'>65111398</p>

              </div>
            </div>

            <div className="row mt-5 mb-5">
              <div className="col-2"></div>
              <div className="col-4">
                <div className="my-team">
                  <img className="img-fluid" src="/image/Other/vee.jpg" alt="" />
                </div>
                <h2 className="text-center mt-3">Supply Unit</h2>
                <hr />
                <p className='text-center'>เทพประทาน จันทร์ปัญญา</p>
                <p className='text-center'>65112056</p>

              </div>

              <div className="col-4">
                <div className="my-team">
                  <img className="img-fluid" src="/image/Other/alex.jpg" alt="" />
                </div>
                <h2 className="text-center mt-3">Researcher, Tester</h2>
                <hr />
                <p className='text-center'>พรหมภัสสร์ โภควิบูลย์</p>
                <p className='text-center'>65111586</p>

              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs