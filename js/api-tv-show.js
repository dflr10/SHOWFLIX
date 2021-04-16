const d = document,
  $shows = d.getElementById("shows"),
  $template = d.getElementById("show-template").content,
  $fragment = d.createDocumentFragment();

d.addEventListener("keypress", async (e) => {
  if (e.target.matches("#search")) {
    if (e.key == "Enter") {
      try {
        $shows.innerHTML = `<img class="loader" src="assets/loader.svg" alt="Loading">`;

        let query = e.target.value.toLowerCase(),
          api = `https://api.tvmaze.com/search/shows?q=${query}`,
          res = await fetch(api),
          json = await res.json();

        //console.log(api, res, json);
        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        if (json.length === 0) {
          $shows.innerHTML = `<h2>No results found search for: <mark>${query}</mark></h2>`;
        } else {
          json.forEach((el) => {
            $template.querySelector("h3").textContent = el.show.name;
            $template.querySelector("div").innerHTML = `<b>Genre: </b>${
              el.show.genres.length != 0 ? el.show.genres[0] : "No Genre."
            }<br><b>Lang: </b>${
              el.show.language ? el.show.language : "No Found"
            }<br><b>Type: </b>${el.show.type ? el.show.type : "No Specified"} `;

            let cutSummary = $template.querySelector("div").content;
            $template.querySelector("img").src = el.show.image
              ? el.show.image.medium
              : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
            $template.querySelector("img").alt = el.show.name;
            $template.querySelector("a").href = el.show.url ? el.show.url : "#";
            $template.querySelector("a").target = el.show.url
              ? "_blank"
              : "_self";
            $template.querySelector("a").textContent = el.show.url
              ? "Ver más..."
              : "";

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
          });
          $shows.innerHTML = "";
          $shows.appendChild($fragment);
        }
      } catch (error) {
        console.log(error);
        let message = error.statusText || "Ocurrió un ERROR";
        $shows.innerHTML = `<p>Error ${error.status}: ${message}</p>`;
      }
    }
  }
});
