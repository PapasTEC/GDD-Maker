import { Pipe, PipeTransform } from "@angular/core";
import { Project } from "./dashboard.component";

@Pipe({ name: "project" })
export class CountryPipe implements PipeTransform {
  transform(values: Project[], filter: string): Project[] {
    if (!filter || filter.length === 0) {
      return values;
    }

    if (values.length === 0) {
      return values;
    }

    return values.filter((value: Project) => {
      const nameFound =
        value.documentTitle.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      const lastUpdatedFound =
        value.lastUpdated.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      const ownerFound =
        value.owner.toLowerCase().indexOf(filter.toLowerCase()) !== -1;

      if (nameFound || lastUpdatedFound || ownerFound) {
        return value;
      }
    });
  }
}
