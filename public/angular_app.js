var app=angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http)
{
  $scope.myForm = function (data) {

       var params=data.Image;

   return $http({
               url: '/data/'+params,
               method: "POST",
          }).then(function(result)

{
$scope.data=result.data;
}

        );
}
});
