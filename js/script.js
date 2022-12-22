let searchInput = document.querySelector("input");

async function getSearchResults() {
	const searchUrl = new URL("https://api.github.com/search/repositories");
	let repositorySearch = searchInput.value;
	if (repositorySearch == "") {
		removeResults();
		return;
	}
	searchUrl.searchParams.append("q", repositorySearch);
	try {
		let response = await fetch(searchUrl);
		if (response.ok) {
			let searchResults = await response.json();
			showResults(searchResults);
		} else return;
	}
	catch (err) {
		return null;
	}
}

let searchBlockResults = document.querySelector(".search-block__results");

function showResults(results) {
	removeResults();
	for (let i = 0; i < 5; i++) {
		let name = results.items[i].name;
		let owner = results.items[i].owner.login;
		let stars = results.items[i].stargazers_count;
		let div = document.createElement("div");
		div.innerHTML = `${name}`;
		div.classList.add("search-block__result");
		div.dataset.owner = `${owner}`;
		div.dataset.stars = `${stars}`;
		searchBlockResults.append(div);
	}
}

const debounce = (fn, debounceTime) => {
	let inDebounce;
	return function () {
		clearTimeout(inDebounce)
		inDebounce = setTimeout(() => fn.apply(this, arguments), debounceTime)
	}
};

const getSearchResultsDebounce = debounce(getSearchResults, 500);
searchInput.addEventListener("input", getSearchResultsDebounce);

function removeResults() {
	searchBlockResults.innerHTML = "";
}

searchBlockResults.addEventListener("click", function (evt) {
	if (evt.target.classList.contains("search-block__result")) {
		saveResult(evt.target);
		searchInput.value = "";
		removeResults();
	} else return;
})

let saved = document.querySelector(".saved");

function saveResult(savedResult) {
	let name = savedResult.textContent;
	let owner = savedResult.dataset.owner;
	let stars = savedResult.dataset.stars;
	let div = document.createElement("div");
	div.classList.add("saved__result");
	let infoDiv = document.createElement("div");
	infoDiv.classList.add("saved__info");
	let pName = document.createElement("p");
	pName.innerHTML = `Name: ${name}`;
	infoDiv.append(pName);
	let pOwner = document.createElement("p");
	pOwner.innerHTML = `Owner: ${owner}`;
	infoDiv.append(pOwner);
	let pStars = document.createElement("p");
	pStars.innerHTML = `Stars: ${stars}`;
	infoDiv.append(pStars);
	div.append(infoDiv);
	let btn = document.createElement("button");
	btn.classList.add("remove-btn");
	div.append(btn);
	saved.append(div);
}

saved.addEventListener("click", function (evt) {
	if (evt.target.classList.contains("remove-btn")) {
		evt.target.parentElement.remove();
	} else return;
})