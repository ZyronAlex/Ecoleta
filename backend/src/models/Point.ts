class Point {  
  id!: Number;
  image: String;
  name: String;
  email: String;
  whatsApp: String;
  latitude: Number;
  longitude: Number;
  city: String;
  uf: String;

  constructor(
    image: String,
    name: String,
    email: String,
    whatsApp: String,
    latitude: Number,
    longitude: Number,
    city: String,
    uf: String
  ) {
    this.image = image;
    this.name = name;
    this.email = email;
    this.whatsApp = whatsApp;
    this.latitude = latitude;
    this.longitude = longitude;
    this.city = city;
    this.uf = uf;
  }
}
export default Point;
