//grabs the form
var userFormEl = document.querySelector("#user-form");
//grabs the username Input
var nameInputEl = document.querySelector("#username");
//variables for right columb elements.
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var languageButtonsEl = document.querySelector("#language-buttons");

var formSubmitHandler = function(event) {
    event.preventDefault();
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        repoContainerEl.textContent = "";
        nameInputEl.value = ""
    } else {
        alert("Please enter a Github username");
    }
}

//fetch repos using github api
var getUserRepos = function(user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    //make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
              response.json()
                .then(function(data) {
                displayRepos(data, user);
                //console.log("inside", response)
                });  
            } else {
                alert("Error: Github User Not Found");
            }
               // console.log("outside");
    })
        .catch(function(error) {
            //Notice this ".catch()" getting chained onto the end of the ".then()" method
            alert("Unable to connect to Github");
        })
};



var displayRepos = function (repos, searchTerm) {
    //check if apu returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
  
    repoSearchTerm.textContent = searchTerm;

    for (var i = 0; i < repos.length; i++) {
        //format repo name = [username]/[repo name]
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        //create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        //append titleEl to container
        repoEl.appendChild(titleEl);
        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            //adds an x in a box
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            //adds a checkmark in a box
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);

        //append container to the DOM
        repoContainerEl.appendChild(repoEl);

    
    
    }
}

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
  
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });     
        } else {
            alert("Error: Github User Not Found");
        }
    });
  };

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    
    if (language) {
        getFeaturedRepos(language);
    }

    //clear old content
    repoContainerEl.textContent = "";
}

//event listener for submit repo
userFormEl.addEventListener("submit", formSubmitHandler);

//event listener for choose language
languageButtonsEl.addEventListener("click", buttonClickHandler);

