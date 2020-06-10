class Item {
  id!: Number;
  image: String;
  title: String;
  
  constructor(image: String, title: String) {
    this.image = image;
    this.title = title;
  }
}
export default Item;
