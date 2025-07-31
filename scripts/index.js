let ipAddress = '';
let domain = '';
let map;    
let mapMarker;
const mapIcon = L.icon({
  iconUrl:'images/icon-location.svg',
  iconSize:[30, 40],
  iconAnchor:[15, 20],
  popupAnchor:[0, -24]
});

const ipInfoDiv = document.querySelector('.js-ip-info');
fetchIP('','');

async function fetchIP(ipAddress, domain){
  try{
    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_hKdNtz3CvxdOY6yXeEM0AS6Hk6HzJ&ipAddress=${ipAddress}&domain=${domain}`);

    const ipGeo = await response.json();

    const ip = ipGeo.ip;
    const city = ipGeo.location.city;
    const region = ipGeo.location.region;
    const country = ipGeo.location.country;
    const zipCode = ipGeo.location.postalCode;
    const timezone = ipGeo.location.timezone;
    const isp = ipGeo.isp || ipGeo.as?.name || 'Unknown ISP';

    const ipInfoHtml = `
     <div class="ip-tracked-address">
             <p class="ip-address">
              IP ADDRESS
            </p>
            <p class="ip-details-address">
              ${ip}
            </p>
           </div>
        
          <div class="ip-tracked-location">
               <p class="ip-location">
                LOCATION
              </p>
              <p class="ip-details-location">
               <span class="city">${city},</span> <span class="region">${region}</span> 
               <span class="zipcode">${zipCode}</span>
            </p>
            </div>
            
            <div class="ip-tracked-timezone">
              <p class="ip-timezone">
              TIMEZONE
              </p>
              <p class="ip-details-timezone">
                UTC${timezone}
            </p>
            </div>
            
            <div class="ip-tracked-isp">
              <p class="ip-isp">
                ISP
              </p>
              <p class="ip-details-isp">
                ${isp}
            </p>
            </div>`
  
    if(ipInfoDiv.classList.contains('error')){ipInfoDiv.classList.remove('error')};
    
    ipInfoDiv.innerHTML = ipInfoHtml;

    const lat = ipGeo.location.lat;
    const long = ipGeo.location.lng;

    if(map){
      map.setView([lat, long], 13);
    }else{
      map = L.map('map').setView([lat, long], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    }

    if(mapMarker){
      map.removeLayer(mapMarker);
    }
    mapMarker = L.marker([lat, long], { icon: mapIcon}).addTo(map)
    .bindPopup(`${city},${region},${country}`).on('click', ()=>{
      map.setView([lat, long], 13);
    });
  }catch{
     ipInfoDiv.innerHTML = `Invalid ip or Domain, Enter Valid Ip or Domain`;
     ipInfoDiv.classList.add('error');
  }
};

document.querySelector('.js-search-button').addEventListener('click', ()=>{
    const searchBar = document.querySelector('.js-search-bar');
    const searchBarValue = searchBar.value.trim();
    searchBar.value = '';

    const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(searchBarValue);

    if(isIp){
      ipAddress = searchBarValue;
      domain = '';
    }else{
      domain = searchBarValue;
      ipAddress = '';
    }
    fetchIP(ipAddress, domain);
});

document.querySelector('.js-search-bar').addEventListener('keydown', (event)=>{
  if(event.key === 'Enter'){
    const searchBar = document.querySelector('.js-search-bar');
    const searchBarValue = searchBar.value.trim();
    searchBar.value = '';

    const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(searchBarValue);

    if(isIp){
      ipAddress = searchBarValue;
      domain = '';
    }else{
      domain = searchBarValue;
      ipAddress = '';
    }
    fetchIP(ipAddress, domain);
  }
});