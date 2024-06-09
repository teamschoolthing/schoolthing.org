import { sql } from "@vercel/postgres";
import { thisURL } from "../resources/strings";
import {TriangleAlert} from "akar-icons"
export default function Test() {
  var name = "oodibaba";
  var a = [];
  /*fetch(`${thisURL}/api/test`)
  .then((res) => {

  });*/
  return (
    <div>
      <h1>{name}</h1>
      <TriangleAlert strokeWidth={2} size={36} />
    </div>
  );
}
