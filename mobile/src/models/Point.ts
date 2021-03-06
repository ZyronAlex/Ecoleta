import Item from "./Item"

interface Point {  
  id: number;
  image: string;
  name: string;
  email: string;
  whatsApp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  items: Item[];
}
export default Point;
