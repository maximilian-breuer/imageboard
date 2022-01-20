**GET IMAGES**
----
  Fetches multiple images, sorted by date in descending order.

* **URL**

  /api/v1/images

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `startTime=number, limit=number`
   
   **Optional:**
 
   `tags=[Tag]`

* **Sample Call:**

  /api/v1/images/?tags=[{"content": "Holiday"},{"content": "Family"}]&startTime=1642179473823&limit=30