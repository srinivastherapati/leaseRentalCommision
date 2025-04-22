
function Footer(){
    return (
        <>
        <div className="dflex jc-around" style={{marginTop : "5%"}}>
            <div className="h-line"></div>
        </div>
        <div className="dflex w100 tcenter ai-center jc-around" style={{ padding : "16px 32px"}}>
            <div>
                <p>Himalayan House Rentals</p>
                <p>2590 Greenhill Way <br/> Oviedo, FL 32765</p>
                <p> (999) 999-9999 </p>
            </div>
            <div className="tcenter">
                2024 &copy; All Copyrights Reserved
            </div>
            <div>
                <p>Mon 10:00 AM - 6:00 PM <br/>
                Tue - Wed 9:00 AM - 6:00 PM <br/>
                Thu 10:00 AM - 6:00 PM <br/>
                Fri 9:00 AM - 6:00 PM <br/>
                Saturday 10:00 AM - 5:00 PM </p>
            </div>
        </div>
        </>
    )
}

export default Footer;