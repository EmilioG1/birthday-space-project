export class ApiCall {
  static get(url, options) {
    if (options === undefined) {
      return fetch(url)
        .then(function (response) {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .catch(function (error) {
          console.log(error);
          return error;
        });
    } else {
      return fetch(url, options)
        .then(function (response) {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .catch(function (error) {
          console.log(error);
          return error;
        });
    }
  }
}
