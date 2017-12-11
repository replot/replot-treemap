import React from "react"
import TreeMap from "../src/index.jsx"

class BasicExample extends React.Component {

  render() {
    const data = [
      {"name":"Saudi Medical Journal","size":361},
      {"name":"PLoS ONE","size":313},
      {"name":"Macromolecules","size":261},
      {"name":"Applied Physics Letters","size":217},
      {"name":"Journal of the American Chemical Society","size":197},
      {"name":"RSC Advances","size":178},
      {"name":"Journal of Applied Physics","size":174},
      {"name":"Fixed Point Theory & Applications","size":169},
      {"name":"Abstract & Applied Analysis","size":163},
      {"name":"Combustion & Flame","size":162},
      {"name":"Acta Crystallographica Section E: Structure Reports Online","size":161},
      {"name":"Journal of Alloys & Compounds","size":150},
      {"name":"Journal of Applied Polymer Science","size":150},
      {"name":"Arabian Journal for Science & Engineering","size":148},
      {"name":"Arabian Journal for Science & Engineering","size":148},
      {"name":"Geophysics","size":143},
      {"name":"Scientific Reports","size":139},
      {"name":"International Journal of Heat & Mass Transfer","size":136},
      {"name":"Desalination","size":135},
      {"name":"SEG Technical Program Exp&ed Abstracts","size":130},
      {"name":"Applied Mathematics & Computation","size":127},
      {"name":"Molecules","size":125},
      {"name":"Annals of Saudi Medicine","size":123},
      {"name":"Desalination & Water Treatment","size":120},
      {"name":"Journal of Molecular Structure","size":119},
      {"name":"Chemical Communications","size":116},
      {"name":"Applied Surface Science","size":112},
      {"name":"Journal of Molecular Liquids","size":105},
      {"name":"Journal of Nanoscience & Nanotechnology","size":101},
      {"name":"African Journal of Biotechnology","size":99},
      {"name":"Langmuir","size":97},
      {"name":"Energy Conversion & Management","size":95},
      {"name":"Procedia Computer Science","size":95},
      {"name":"Energy","size":93},
      {"name":"Physical Chemistry Chemical Physics","size":91},
      {"name":"Proceedings of the Combustion Institute","size":88},
      {"name":"Arabian Journal of Chemistry","size":87},
      {"name":"Chemistry of Materials","size":86},
      {"name":"European Journal of Medicinal Chemistry","size":85},
      {"name":"Materials Letters","size":84},
      {"name":"Physica B: Condensed Matter","size":81},
      {"name":"Talanta","size":81},
      {"name":"Tetrahedron Letters","size":81},
      {"name":"Nucleic Acids Research","size":81},
      {"name":"Chemical Engineering Journal","size":80},
      {"name":"Polymer","size":76},
      {"name":"International Communications in Heat & Mass Transfer","size":76},
      {"name":"Saudi Journal of Biological Sciences","size":75},
      {"name":"Advanced Materials Research","size":74},
      {"name":"Food Chemistry","size":73}
    ]

    return(
      <div>
        <TreeMap data={data} weightKey="size"
          keyOrder={["name", "size"]} width="100%"
          titleScale={2} maxOtherSize={0.15} otherThreshold={0.02}
        />
      </div>
    )
  }
}


export default BasicExample
