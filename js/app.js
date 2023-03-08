const initialDisplayCount = 6;
let currentDisplayCount = initialDisplayCount;
const spinner = document.getElementById("spinner");
const seeMoreBtn = document.getElementById("see-more");
spinner.classList.remove("hidden");

fetch("https://openapi.programming-hero.com/api/ai/tools")
  .then((response) => response.json())
  .then((data) => displayData(data.data.tools, initialDisplayCount))

const displayData = (allData, displayCount) => {
    const dataContainer = document.getElementById("data-container");
    dataContainer.innerHTML = "";
    allData.slice(0, displayCount).forEach((data) => {
    const dataDiv = document.createElement("div");

    dataDiv.innerHTML = `<div class="rounded-xl shadow-lg shadow-gray-200 bg-white duration-300 hover:-translate-y-1 border">
    <div>
      <figure class="px-5 pt-5">
        <img src="${data.image}" class="rounded-xl w-full h-80 object-cover" />
      </figure>
      <div class="h-30 p-4">
        <h1 class="text-lg mb-2 font-bold leading-relaxed text-black">Features</h1>
        <h6 class="leading-5 mb-1 text-black">1. ${data.features[0] ? data.features[0] : 'No Data Found'}</h6>
        <h6 class="leading-5 mb-1 text-black">2. ${data.features[1] ? data.features[1] : 'No Data Found'}</h6>
        <h6 class="leading-5 mb-1 text-black">3. ${data.features[2] ? data.features[2] : 'No Data Found'}</h6>
        <hr class="border border-gray-300 mt-4">
      </div>
      <div class="p-4 flex justify-between">
        <div class="">
          <h1 class="text-lg mb-2 font-bold leading-relaxed text-black">${data.name}</h1>
          <h6 class="leading-5 mb-1 text-black"><i class="fa-solid fa-calendar-days mr-3"></i>${data.published_in}</h6>
        </div>
        <button onclick="openModal();loadToolsDetails('${data.id}')" class="w-10 h-10 cursor-pointer rounded-full flex bg-[#FEF7F7] items-center justify-center hover:bg-red-200"><i class="fa-solid fa-arrow-right text-red-500"></i></button>
      </div>
    </div>
  </div>`;
    dataContainer.appendChild(dataDiv);
    spinner.classList.add("hidden");
  });
  seeMoreBtn.addEventListener("click", () => {
    currentDisplayCount += initialDisplayCount;
    displayData(allData, currentDisplayCount);
  });
};

//sort by date
const sortByDate = () => {
  fetch('https://openapi.programming-hero.com/api/ai/tools')
    .then(response => response.json())
    .then(data => {
      const mainData = data.data.tools;
      data.data.tools.sort((a, b) => new Date(a.published_in) - new Date(b.published_in));
      displayData(mainData.slice(0, currentDisplayCount));
    });
    seeMoreBtn.addEventListener('click', () => {
      currentDisplayCount += 6;
      sortByDate()
    });
};

// Display tools details
const loadToolsDetails = (Id) => {
    const url = `https://openapi.programming-hero.com/api/ai/tool/${Id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => DisplayLoadToolsDetails(data.data));
  };
  const DisplayLoadToolsDetails = (data) => {
  document.getElementById('desc').innerText = data.description
  document.getElementById('tool-image').innerHTML = `<img class="object-cover w-full h-60"src="${data.image_link[0]}">`
  
  document.getElementById('basic').innerHTML = `
  <h2 class="font-bold py-2">${data.pricing ? data.pricing[0].price : 'Basic'}</h2>
  <h2 class="font-bold py-2">${data.pricing ? data.pricing[0].plan : 'Free of Cost'}</h2>`
  
  document.getElementById('pro').innerHTML = `
  <h2 class="font-bold py-2">${ data.pricing ? data.pricing[1].price : 'Pro'}</h2>
  <h2 class="font-bold py-2">${ data.pricing ? data.pricing[1].plan : 'Free of Cost'}</h2>`
  
  document.getElementById('enterprise').innerHTML = `
  <h2 class="font-bold py-2">${data.pricing ? data.pricing[2].price :'Enterprise'}</h2>
  <h2 class="font-bold py-2">${data.pricing ? data.pricing[2].plan : 'Free of Cost'}</h2>`
  
    const features = data.features ? Object.values(data.features) : [];
    const featuresHTML = features.filter(f => f.feature_name)
        .map(f => `<li class="py-2 font-bold">${f.feature_name}</li>`)
        .join("") || '<li class="py-2 font-bold">No Features Found</li>';
    document.getElementById('features').innerHTML = featuresHTML;
    
    const integrationList = document.getElementById('integration');
    const integrations = data.integrations || []; 
    const integrationHTML = integrations.filter(i => i !== undefined)
        .map(i => `<li class="py-2 font-bold ">${i}</li>`)
        .join("") || '<li class="py-2 font-bold ">No data found</li>';
    integrationList.innerHTML = integrationHTML;

    document.getElementById('input-output').innerHTML = `<div class="font-bold text-xl mb-2 text-center">${data.input_output_examples===null? 'Can you give any example?': data.input_output_examples[0].input}</div>
    <div class="text-center text-gray-600 text-sm">${data.input_output_examples===null ?'No! Not Yet! Take a break!!!': data.input_output_examples[0].output }</div>`

    const accuracyDiv = document.getElementById('accuracy');
        if (data.accuracy.score === null) {
        accuracyDiv.style.display = 'none';} 
        else {
    accuracyDiv.style.display = 'block';
    accuracyDiv.innerHTML = `<p>${(data.accuracy.score)*100}% accuracy</p>`;
    }
}
//modal 
function openModal() {
    document.getElementById("modal").classList.remove("hidden");
  }
function closeModal() {
    document.getElementById("modal").classList.add("hidden");
  }