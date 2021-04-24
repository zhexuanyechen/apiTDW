<?php

/**
 * tests/Controller/LoginControllerTest.php
 *
 * @license  https://opensource.org/licenses/MIT MIT License
 * @link     http://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\Test\ACiencia\Controller;

use Faker\Factory;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use TDW\ACiencia\Entity\Role;
use TDW\ACiencia\Utility\Error;
use TDW\ACiencia\Utility\Utils;

use function base64_decode;

/**
 * Class LoginControllerTest
 */
class LoginControllerTest extends BaseTestCase
{
    /** @var string path de login */
    private static $ruta_base;

    protected static array $writer;
    protected static array $reader;

    /**
     * This method is called before the first test of this test class is run.
     */
    public static function setUpBeforeClass(): void
    {
        self::$ruta_base = $_ENV['RUTA_LOGIN'];

        // Fixture: writer
        $faker = Factory::create('es_ES');
        self::$writer = [
            'username' => $faker->userName,
            'email'    => $faker->email,
            'password' => $faker->password,
        ];

        // load user admin/writer fixtures
        self::$writer['id'] = Utils::loadUserData(
            self::$writer['username'],
            self::$writer['email'],
            self::$writer['password'],
            true
        );

        // Fixture: reader
        self::$reader = [
            'username' => $faker->userName,
            'email'    => $faker->email,
            'password' => $faker->password,
        ];

        // load user reader fixtures
        self::$reader['id'] = Utils::loadUserData(
            self::$reader['username'],
            self::$reader['email'],
            self::$reader['password'],
            false
        );
    }

    /**
     * Test POST /login 404 NOT FOUND
     * @param array $data
     * @dataProvider proveedorUsuarios()
     */
    public function testPostLogin404NotFound(array $data): void
    {
        $response = $this->runApp(
            'POST',
            self::$ruta_base,
            $data
        );

        self::assertSame(StatusCode::STATUS_NOT_FOUND, $response->getStatusCode());
        $r_body = $response->getBody()->getContents();
        self::assertJson($r_body);
        $r_data = json_decode($r_body, true);
        self::assertArrayHasKey('code', $r_data);
        self::assertArrayHasKey('message', $r_data);
        self::assertSame(StatusCode::STATUS_NOT_FOUND, $r_data['code']);
        self::assertSame(
            Error::MESSAGES[StatusCode::STATUS_NOT_FOUND],
            $r_data['message']
        );
    }

    /**
     * Test POST /login 200 OK
     */
    public function testPostLogin200Ok(): void
    {
        $data = [
            'username' => self::$writer['username'],
            'password' => self::$writer['password']
        ];
        $response = $this->runApp(
            'POST',
            self::$ruta_base,
            $data
        );

        self::assertSame(200, $response->getStatusCode());
        $r_body = $response->getBody()->getContents();
        self::assertJson($r_body);
        self::assertTrue($response->hasHeader('Authorization'));
        $r_data = json_decode($r_body, true);
        self::assertNotEmpty($r_data['access_token']);
    }

    /**
     * @param string $user [ reader | writer ]
     * @param array $reqScopes
     * @param string $expectedScope
     *
     * @dataProvider proveedorAmbitos()
     */
    public function testLoginWithScopes200Ok(string $user, array $reqScopes, string $expectedScope): void
    {
        $userData = ('reader' === $user) ? self::$reader : self::$writer;
        $post_data = [
            'username' => $userData['username'],
            'password' => $userData['password'],
            'scope'    => implode('+', $reqScopes),
        ];
        $response = $this->runApp(
            'POST',
            self::$ruta_base,
            $post_data
        );

        self::assertSame(200, $response->getStatusCode());
        self::assertTrue($response->hasHeader('Authorization'));
        $r_body = $response->getBody()->getContents();
        self::assertJson($r_body);
        $r_data = json_decode($r_body, true);
        self::assertSame('Bearer', $r_data['token_type']);
        self::assertGreaterThan(0, $r_data['expires_in']);
        self::assertNotEmpty($r_data['access_token']);

        $payload = explode('.', $r_data['access_token']);
        $data = json_decode(base64_decode($payload[1]), true);
        self::assertTrue(in_array($expectedScope, $data['scopes']));
    }

    // --------------
    // DATA PROVIDERS
    // --------------

    public function proveedorUsuarios(): array
    {
        $faker = Factory::create('es_ES');
        $fakeUsername = $faker->userName;
        $fakePasswd = $faker->password;

        return [
            'empty_user'  => [
                [ ]
            ],
            'no_password' => [
                [ 'username' => $fakeUsername ]
            ],
            'no_username' => [
                [ 'password' => $fakePasswd ]
            ],
            'incorrect_username' => [
                [ 'username' => $fakeUsername, 'password' => $fakePasswd ]
            ],
            'incorrect_passwd' => [
                [ 'username' => $fakeUsername, 'password' => $fakePasswd ]
            ],
        ];
    }

    /**
     * [userdata, requestedScope, expectedScope]
     * @return array
     */
    public function proveedorAmbitos(): array
    {
        return [
            'reader -- r' => ['reader', [], Role::ROLE_READER],
            'reader r- r' => ['reader', [Role::ROLE_READER], Role::ROLE_READER],
            'reader rw r' => ['reader', [Role::ROLE_READER, Role::ROLE_WRITER], Role::ROLE_READER],
            'reader -w r' => ['reader', [Role::ROLE_WRITER], Role::ROLE_READER],
            'writer -- r' => ['writer', [], Role::ROLE_READER],
            'writer -- w' => ['writer', [], Role::ROLE_WRITER],
            'writer r- r' => ['writer', [Role::ROLE_READER], Role::ROLE_READER],
            'writer -w w' => ['writer', [Role::ROLE_WRITER], Role::ROLE_WRITER],
            'writer rw w' => ['writer', [Role::ROLE_READER, Role::ROLE_WRITER], Role::ROLE_WRITER],
        ];
    }
}
