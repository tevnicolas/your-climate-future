'use strict';
const currentDate = new Date().getFullYear();
const $form = document.querySelector('.landing-form');
const $landingFormElements = $form.elements;
const $landingPage = document.querySelector('div[data-view="landing-page"]');
const $formPage = document.querySelector('div[data-view="form-page"]');
const $entriesPage = document.querySelector('div[data-view="entries-page"]');
const $loadingPage = document.querySelector('div[data-view="loading-page"]');
const $formHook = document.querySelector('.form-page');
const $entriesHook = document.querySelector('.entries-page');
const $header = document.querySelector('#header');
const $headerText = document.querySelector('#header-text');
const $entriesText = document.querySelector('#entries-text');
const $newEntryButtonFormPage = document.querySelector(
  '.form-page .buttonpos1',
);
const $newEntryButtonEntriesPage = document.querySelector(
  '.entries-page .buttonpos1',
);
const $noEntries = document.querySelector('.no-entries');
if (!$form) throw new Error('$form query failed.');
if (!$landingPage) throw new Error('$landingPage query failed.');
if (!$formPage) throw new Error('$formPage query failed.');
if (!$entriesPage) throw new Error('$entriesPage query failed.');
if (!$loadingPage) throw new Error('$loadingPage query failed.');
if (!$formHook) throw new Error('$formHook query failed.');
if (!$entriesHook) throw new Error('$entriesHook query failed.');
if (!$header) throw new Error('$header query failed.');
if (!$headerText) throw new Error('$headerText query failed.');
if (!$entriesText) throw new Error('$entriesText query failed.');
if (!$newEntryButtonFormPage)
  throw new Error('$newEntryButtonFormPage query failed.');
if (!$newEntryButtonEntriesPage)
  throw new Error('$newEntryButtonEntriesPage query failed.');
if (!$noEntries) throw new Error('$noEntries query failed.');
$form.addEventListener('submit', async (event) => {
  event.preventDefault();
  viewSwap('loading-page');
  const getRequestArr = await getRequest($landingFormElements.city.value);
  const entriesObject = {
    title: getRequestArr[0],
    year: '2100',
    resultDescription: getRequestArr[1],
    imageLink: getRequestArr[2],
    entryId: data.nextEntryId,
  };
  data.nextEntryId++;
  data.entries.unshift(entriesObject);
  const $newRowTreeFormStyle = render(entriesObject, 'long');
  $formHook.prepend($newRowTreeFormStyle);
  const $newRowTreeEntriesStyle = render(entriesObject, 'short');
  $entriesHook.prepend($newRowTreeEntriesStyle);
  hideOtherEntriesExcept('last');
  viewSwap('form-page');
  $form.reset();
});
$header.addEventListener('click', (event) => {
  event.preventDefault();
  const $eventTarget = event.target;
  switch ($eventTarget) {
    case $headerText:
      viewSwap('landing-page');
      break;
    case $entriesText:
      viewSwap('entries-page');
      break;
  }
});
$formHook.addEventListener('click', (event) => {
  event.preventDefault();
  const $eventTarget = event.target;
  switch ($eventTarget) {
    case $newEntryButtonFormPage:
      viewSwap('landing-page');
      break;
  }
});
$entriesHook.addEventListener('click', (event) => {
  event.preventDefault();
  const $eventTarget = event.target;
  if ($eventTarget === $newEntryButtonEntriesPage) {
    viewSwap('landing-page');
  } else if ($eventTarget.tagName === 'H1') {
    const $shortRowTarget = $eventTarget.closest('[data-entry-id]');
    const dataEntryIDTarget = Number(
      $shortRowTarget.getAttribute('data-entry-id'),
    );
    hideOtherEntriesExcept(dataEntryIDTarget);
    viewSwap('form-page');
  }
});
document.addEventListener('DOMContentLoaded', () => {
  for (const entry of data.entries) {
    const $newRowTreeFormStyle = render(entry, 'long');
    const $newRowTreeEntriesStyle = render(entry, 'short');
    $formHook.appendChild($newRowTreeFormStyle);
    $entriesHook.appendChild($newRowTreeEntriesStyle);
  }
  toggleNoEntries(); // not sure if I need this here
  viewSwap(data.view); // not certain why this is here yet
  $form.reset(); // also not 100% if this needs to be here
});
function render(entry, option) {
  const rowType = option === 'short' ? 'short-row' : 'row';
  const pType = option === 'short' ? 'short-paragraph' : '';
  const pointer = option === 'short' ? 'pointer' : '';
  const $divRow = document.createElement('div');
  $divRow.setAttribute('class', rowType);
  $divRow.setAttribute('data-entry-id', String(entry.entryId));
  const $divColHalf = document.createElement('div');
  $divColHalf.setAttribute('class', 'column-half');
  const $divImageContainer = document.createElement('div');
  $divImageContainer.setAttribute('class', 'image-container');
  const $image = document.createElement('img');
  $image.setAttribute('class', 'image');
  $image.setAttribute('src', entry.imageLink);
  $image.setAttribute('alt', entry.title);
  const $divColHalf2 = document.createElement('div');
  $divColHalf2.setAttribute('class', 'column-half');
  const $divTextual = document.createElement('div');
  $divTextual.setAttribute('class', 'textual');
  const $cityHeading = document.createElement('h1');
  $cityHeading.setAttribute('class', pointer);
  $cityHeading.textContent = entry.title;
  const $description = document.createElement('p');
  $description.setAttribute('class', pType);
  $description.innerHTML = entry.resultDescription;
  $divTextual.appendChild($cityHeading);
  $divTextual.appendChild($description);
  $divColHalf2.appendChild($divTextual);
  $divImageContainer.appendChild($image);
  $divColHalf.appendChild($divImageContainer);
  $divRow.appendChild($divColHalf);
  $divRow.appendChild($divColHalf2);
  return $divRow;
}
function hideOtherEntriesExcept(option) {
  let entryNum = 0;
  const $listOfFormEntries = $formHook.querySelectorAll('[data-entry-id]');
  if (option === 'last') {
    entryNum = $listOfFormEntries.length;
  } else {
    entryNum = option;
  }
  for (let i = 0; i <= $listOfFormEntries.length; i++) {
    const $hideOtherEntries = $formHook.querySelector(
      `div[data-entry-id="${i}"]`,
    );
    if (i !== entryNum) {
      $hideOtherEntries?.setAttribute('class', 'row hidden');
    } else {
      $hideOtherEntries?.setAttribute('class', 'row');
    }
  }
}
function toggleNoEntries() {
  const $listOfEntriesEntries =
    $entriesHook.querySelectorAll('[data-entry-id]');
  if ($listOfEntriesEntries.length === 0) {
    $noEntries.setAttribute('class', 'column-full no-entries');
  } else {
    $noEntries.setAttribute('class', 'column-full no-entries hidden');
  }
}
async function getCoordinates(locationEntry) {
  try {
    const locationArr = locationEntry.split(' ');
    let location = '';
    for (const word of locationArr) {
      location += word + '%20';
    }
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=` +
        `${location}&apiKey=24eee991e6a741b48f4dd298bf8f58a4`,
    );
    const result = await response.json();
    if (!response.ok) throw new Error('Yikes Error Code: ' + response.status);
    const properLocationName = result.features[0].properties.formatted;
    const coordinatesArr = result.features[0].geometry.coordinates;
    return [...coordinatesArr, properLocationName];
  } catch (error) {
    console.log('Throw getCoordinates() Error', error);
    throw error;
  }
}
async function getClimateDetails(coordsAndProperName, futureYear) {
  try {
    const lat = coordsAndProperName[1];
    const long = coordsAndProperName[0];
    // Encode the target URL with the appropriate route, parameters, and model
    const targetUrl = encodeURIComponent(
      `http://repicea.dynu.net/biosim/BioSimWeather?lat=` +
        `${lat}&long=${long}&from=${currentDate}&to=2100&model=Climatic` +
        `_Annual&rcp=8_5&climMod=GCM4&format=json`,
    );
    // Fetch the data 10 times using a CORS proxy to avoid cross-origin issues
    const responses = await Promise.all(
      new Array(11).fill(null).map(async () => {
        return fetch(`https://lfz-cors.herokuapp.com/?url=${targetUrl}`);
      }),
    );
    const results = await Promise.all(
      responses.map(async (response) => {
        if (!response.ok) {
          throw new Error('Yikes Error Code: ' + response.status);
        }
        return response.json();
      }),
    );
    let meanHighCurr = 0;
    let highestCurr = 0;
    let totalPrcpCurr = 0;
    let meanHighFuture = 0;
    let highestFuture = 0;
    let totalPrcpFuture = 0;
    for (let i = 0; i < results.length; i++) {
      meanHighCurr +=
        (Number(results[i].Climatic_Annual[0][0][0].MeanTmax) * 9) / 5 + 32;
      highestCurr +=
        (Number(results[i].Climatic_Annual[0][0][0].HitghestTmax) * 9) / 5 + 32;
      totalPrcpCurr += Number(results[i].Climatic_Annual[0][0][0].TotalPrcp);
      meanHighFuture +=
        (Number(results[i].Climatic_Annual[0][0][76].MeanTmax) * 9) / 5 + 32;
      highestFuture +=
        (Number(results[i].Climatic_Annual[0][0][76].HitghestTmax) * 9) / 5 +
        32;
      totalPrcpFuture += Number(results[i].Climatic_Annual[0][0][76].TotalPrcp);
    }
    const averagedResultObj = {
      formattedLocationName: coordsAndProperName[2],
      meanOfHighTempsCurrentYear:
        (meanHighCurr / results.length).toFixed() + '°F',
      highestTempOfCurrentYear: (highestCurr / results.length).toFixed() + '°F',
      totalPrecipitationCurrentYear:
        (totalPrcpCurr / results.length).toFixed() + 'mm',
      futureYear,
      meanOfHighTempsFutureYear:
        (meanHighFuture / results.length).toFixed() + '°F',
      highestTempOfFutureYear:
        (highestFuture / results.length).toFixed() + '°F',
      totalPrecipitationFutureYear:
        (totalPrcpFuture / results.length).toFixed() + 'mm',
    };
    return averagedResultObj;
  } catch (error) {
    console.log('Throw getClimateDetails Error', error);
    throw error;
  }
}
async function startAnalysisThread(promptText) {
  try {
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer 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',
        'OpenAI-Beta': 'assistants=v1',
      },
    });
    if (!threadResponse.ok) {
      throw new Error(
        `HTTP error when creating a thread! status: ${threadResponse.status}`,
      );
    }
    const threadData = await threadResponse.json();
    const threadId = threadData.id;
    const data = {
      role: 'user',
      content: promptText,
    };
    const inputResponse = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer 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',
          'OpenAI-Beta': 'assistants=v1',
        },
        body: JSON.stringify(data),
      },
    );
    if (!inputResponse.ok) {
      throw new Error(
        `HTTP error when adding input message! Status: ${inputResponse.status}`,
      );
    }
    return threadId;
  } catch (error) {
    console.log('Throw getClimateAnalysis Error', error);
    throw error;
  }
}
async function createAnalysisRun(threadId) {
  try {
    const runResponse = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer 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',
          'OpenAI-Beta': 'assistants=v1',
        },
        body: JSON.stringify({ assistant_id: 'asst_zugUooF8ONOkoEqoD2Hc0wWz' }),
      },
    );
    if (!runResponse.ok) {
      throw new Error(
        `HTTP error in creating a run Status ${runResponse.status}`,
      );
    }
    const runData = await runResponse.json();
    await waitForRunCompletion(threadId, runData.id);
    return runData.thread_id;
  } catch (error) {
    console.log('Error creating a run: ', error);
    throw error;
  }
}
async function waitForRunCompletion(threadId, runId) {
  let runCompleted = false;
  while (!runCompleted) {
    const runStatusResponse = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
      {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer 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',
          'OpenAI-Beta': 'assistants=v1',
        },
      },
    );
    const runStatusData = await runStatusResponse.json();
    if (runStatusData.status === 'completed') {
      runCompleted = true;
    } else {
      // Wait for a short period before polling again
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
    }
  }
}
async function getAnalysisResponse(runThreadId) {
  try {
    const messagesResponse = await fetch(
      `https://api.openai.com/v1/threads/${runThreadId}/messages`,
      {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer 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', // Replace with your actual API key
          'OpenAI-Beta': 'assistants=v1',
        },
      },
    );
    if (!messagesResponse.ok) {
      throw new Error(
        `HTTP error when fetching messages! Status: ${messagesResponse.status}`,
      );
    }
    const messagesData = await messagesResponse.json();
    const analysisResponse = messagesData.data[0].content[0].text.value;
    return analysisResponse;
  } catch (error) {
    console.error('Error fetching Assistant responses:', error);
    throw error;
  }
}
async function getRequest(locationEntry, yearEntry = '2100') {
  const coordsArr = await getCoordinates(locationEntry);
  const climateDataObj = await getClimateDetails(coordsArr, yearEntry);
  const dataForGPT = JSON.stringify(climateDataObj, null, 2);
  const threadId = await startAnalysisThread(dataForGPT);
  const runThreadId = await createAnalysisRun(threadId);
  const analysis = (await getAnalysisResponse(runThreadId)).replace(
    /\n/g,
    '<br>',
  );
  console.log(analysis);
  return [
    climateDataObj.formattedLocationName,
    analysis,
    `/images/DALL·E 2024-03-06 09.38.46 - Capture the essence of Irvine, ` +
      `California, with a focus on its distinctive characteristics. The image ` +
      `should feature the blend of urban and suburban e.webp`,
  ];
}
function viewSwap(view) {
  if (view === 'landing-page') {
    $landingPage.setAttribute('class', '');
    $formPage.setAttribute('class', 'hidden');
    $entriesPage.setAttribute('class', 'hidden');
    $loadingPage.setAttribute('class', 'hidden');
    $form.reset();
  } else if (view === 'form-page') {
    $formPage.setAttribute('class', '');
    $landingPage.setAttribute('class', 'hidden');
    $entriesPage.setAttribute('class', 'hidden');
    $loadingPage.setAttribute('class', 'hidden');
  } else if (view === 'entries-page') {
    $entriesPage.setAttribute('class', '');
    $formPage.setAttribute('class', 'hidden');
    $landingPage.setAttribute('class', 'hidden');
    $loadingPage.setAttribute('class', 'hidden');
    toggleNoEntries();
  } else if (view === 'loading-page') {
    $loadingPage.setAttribute('class', '');
    $entriesPage.setAttribute('class', 'hidden');
    $formPage.setAttribute('class', 'hidden');
    $landingPage.setAttribute('class', 'hidden');
  }
}
