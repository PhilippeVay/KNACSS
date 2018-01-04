# Tests pour KNACSS

Ce répertoire `./test/` contient les premiers cas de tests pour grillade et à terme KNACSS dans son ensemble (on en est pas là en ce début 2018).

## Mise en oeuvre

* `npm i` pour installer les nouvelles dépendances
* `gulp css` pour recompiler si nécessaire KNACSS
* `npm run test` ou `gulp test` pour générer les pages HTML de tests de grillade et leur index
* Et c'est tout pour l'instant. @TODO implémenter des tests de régression visuelle avec [BackstopJS](https://github.com/garris/BackstopJS)

## Comment ça marche ?

4 pages écrites avec le moteur de template Pug (le nouveau nom de Jade) et beaucoup de boucles génèrent des cas pour grillade. Ils sont relativement simples mais complets quand par exemple ils testent un cas avec _tous_ les nombres de colonnes possibles de 2 à 12.
Ces templates Pug (et leur index.html) sont compilés en pages HTML via gulp-pug et une tâche `gulp test` (que l'on peut lancer via le script npm `npm run test`). Ils utilisent une CSS avec quelques styles de présentation et soit `knacss.css` pour la 1ère page (Auto)grid soit uniquement `grillade-grid.css` pour les 3 autres pages.

Ces pages seront utilisées par `backstopJS` pour détecter toute régression visuelle dans les prochaines versions de KNACSS. Cet outil peut entre autres utiliser le moteur de rendu de Chrome Headless (via chromy) et génèrer un rapport HTML tout prêt pour présenter les différences détectées entre des visuels réalisés à un instant T et des visuels de référence réalisés dans le passé, dans toutes les résolutions souhaitées.
