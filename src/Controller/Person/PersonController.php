<?php

/**
 * src/Controller/Person/PersonController.php
 *
 * @license  https://opensource.org/licenses/MIT MIT License
 * @link     http://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Controller\Person;

use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use TDW\ACiencia\Controller\ElementBaseController;
use TDW\ACiencia\Entity\Person;
use TDW\ACiencia\Utility\Error;

/**
 * Class PersonController
 */
class PersonController extends ElementBaseController
{
    /** @var string ruta api gestión personas  */
    public const PATH_PERSONS = '/persons';

    /**
     * Summary: Returns all persons
     *
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function cget(Request $request, Response $response): Response
    {
        return $this->getAllElements($request, $response, Person::class, 'persons');
    }

    /**
     * Summary: Returns a person based on a single personId
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     *
     * @return Response
     */
    public function get(Request $request, Response $response, array $args): Response
    {
        return $this->getElementById($request, $response, Person::class, $args['personId']);
    }

    /**
     * Summary: Returns status code 204 if personname exists
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     */
    public function getPersonname(Request $request, Response $response, array $args): Response
    {
        return $this->getElementByName($response, Person::class, $args['personname']);
    }

    /**
     * Summary: Deletes a person
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        return $this->opDelete($request, $response, Person::class, $args['personId']);
    }

    /**
     * Summary: Creates a new person
     *
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function post(Request $request, Response $response): Response
    {
        return $this->opPost($request, $response, Person::class);
    }

    /**
     * Summary: Updates a person
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     */
    public function put(Request $request, Response $response, array $args): Response
    {
        $args['id'] = $args['personId'];
        return $this->opPut($request, $response, $args, Person::class);
    }
}
