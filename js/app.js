var myApp = angular.module('myApp', ['ngRoute']);

angular
  .module('myApp').service('fileUpload', function ($http, $log) {
    this.uploadFileToUrl = function (file, uploadUrl, type) {

      var fd = new FormData();
      fd.append('file', file);
      fd.append('param', type);

      if (file != undefined) {
        console.log(file.type);
        var validExts = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']; // Allowed Extensions
        if (validExts.indexOf(file.type) == -1) {
          alert('Check File Type', 'Allowed files are pdf,jpg,jpeg and png.', 'warning');
          return;
        }
        if (file.type == "text/plain") {
          file.type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
        if (file.size >= 10 * 1024 * 1024) {  // Max Upload Size is 2MB
          alert('Check File Size', 'Max Upload size is 2 Mb', 'warning');
          return;
        }
      }

      var ret = $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined, withCredentials: true }
      }).then(function (response) {
        if (response.data.error == true)
          alert('Problem in Upoading file', response.data.msg, 'warning');
        return response;
      }).catch(function (response) {
        alert('Error', 'File Could Not Be Uploaded..', 'error');
      });
      return ret;

    }

  });

myApp.config(function ($routeProvider) {

  $routeProvider
    .when('/', {
      templateUrl: 'pages/index.html',
      controller: 'homeController'
    }).when('/upload', {
      templateUrl: 'pages/upload.html',
      controller: 'uploadController'
    }).when('/dash', {
      templateUrl: 'pages/dash.html',
      controller: 'dashController'
    }).when('/view', {
      templateUrl: 'pages/view.html',
      controller: 'viewController'
    }).when('/analyse', {
      templateUrl: 'pages/charts.html',
      controller: 'chartController'
    })
});

myApp.controller('homeController', ['$scope', '$http', '$location', '$window', '$rootScope', function ($scope, $http, $location, $window, $rootScope) {
}]);
myApp.controller('chartController', ['$scope', '$http', '$location', '$window', '$rootScope', function ($scope, $http, $location, $window, $rootScope) {
  var ctx = document.getElementById("myChart2").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: ["18-44", "45-64", "65-74", "75+", "Adjusted"],
          datasets: [{
              label: '% Diabetes- US',
              data: [2.6, 12.9, 22.5, 21.2, 9.1],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
         
      }
  });


  var ctx = document.getElementById("myChart1").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
          labels: ["China", "India", "United States", "Brazil", "Mexico", "Indonesia", "Russia", "Egypt", "Germany", "Pakistan"],
          datasets: [{
              label: '% Diabetes in millions',
              data: [114.4, 72.9, 30.2, 12.5, 12, 10.3, 8.5, 8.2, 7.5, 4.5],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
         
      }
  });


}]);
myApp.controller('viewController', ['$scope', '$http', '$location', '$window', '$rootScope', function ($scope, $http, $location, $window, $rootScope) {
  console.log($window.sessionStorage.user_aadhaar)
  $http({
    url: 'http://localhost:3000/address',
    method: "POST",
    data: {address:$window.sessionStorage.user_aadhaar  }
  })
    .then(function (response) {
      $scope.records = response.data.addressData.addressTransaction;
      console.log(response);
      console.log($scope.records);
    })
    }]);


myApp.controller('dashController', ['$scope', '$http', '$location', '$window', '$rootScope', 'fileUpload', function ($scope, $http, $location, $window, $rootScope, fileUpload) {
  $scope.ages = [];
  for (i = 1; i <= 100; i++) {
    $scope.ages.push(i)
  }
  $scope.upload = function (files) {
    console.log(files[0].name);
    myFile1 = [];
    myFile1.push(files[0]);
  }

  $scope.add_medical = function () {
    var promise = fileUpload.uploadFileToUrl(myFile1[0], 'http://localhost:3000/upload_medical', 'dimensionfile33');
    promise.then(
      function (response) {
        medical = 'http://localhost:3000/' + response.data.file;
        $http({
          url: 'http://localhost:3000/transaction/broadcast',
          method: "POST",
          data: { recipient: $window.sessionStorage.user_aadhaar, url: medical, symptoms: $scope.symptoms, disease: $scope.disease, treatment: $scope.treatment, location: $scope.location, amount: $scope.amount, doctor: $scope.doctor, age: $scope.input_age, weight: $scope.input_weight }
        })
          .then(function (response) {
            if (response.data.success == true) {
              swal("Success", "Medical Record Inserted SuccessFully", "success");
            }
          })
      });
  }
}]);

myApp.controller('uploadController', ['$scope', '$http', '$location', '$window', '$rootScope', 'fileUpload', '$timeout', function ($scope, $http, $location, $window, $rootScope, fileUpload, $timeout) {
  $scope.scroll = false;
  $scope.upload = function (files) {
    $scope.scroll = true;
    console.log(files[0].name);
    myFile1 = [];
    myFile1.push(files[0]);
    var promise = fileUpload.uploadFileToUrl(myFile1[0], 'http://localhost:3000/upload_aadhaar', 'dimensionfile');
    promise.then(
      function (response) {
        if (response.data.success == true) {
          $scope.scroll = false;
          $window.sessionStorage.setItem("user_aadhaar", response.data.aadhaar);
          $window.location.href = '#/dash';

        }
      });
  }

}]);