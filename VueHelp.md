# Vue cheat sheet

## **Views map**
*Here you create components that are not used in every loadout of the page, for example a login view*
- 1: You create your component map named **HelloWorld**
- 2: You create a **HelloWorld.vue** file in the HelloWorld map
- 3: You create a **routes.js** file in the HelloWorld map
### **This is a basic build up in your views map**

#
## **Components map**
*Here you create components that are used in every page, for example a header, a header is loaded almost every time you use the page*
- Here you only create the **.vue** file without any map

#
## **Assets map**
*You basically store every **image**, **css**, **scss** files in here*


#

## **Router map**
*Here you spread out the routes.js that you stored in the views maps*

#
## **Store**
- main purpose is to save/get data in store
- commit changes
- get values

## **Services**
- main purpose is to call API calls in here
### **you make calls from store to services when making api calls**

#
