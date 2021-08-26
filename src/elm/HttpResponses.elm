module HttpResponses exposing(..)

import Browser
import Html exposing(Html, div, text)
import Html.Attributes exposing(class)
import Json.Decode as Decode
import Json.Decode.Pipeline

type alias User =
  { id: Int
  , name: String
  }

decodeUsers : Decode.Decoder (List User)
decodeUsers =
  Decode.list decodeUser

decodeUser : Decode.Decoder User
decodeUser =
  Decode.succeed User
    |> Json.Decode.Pipeline.required "id" Decode.int
    |> Json.Decode.Pipeline.required "name" Decode.string

type alias Flags =
  {
  }

type alias Model =
  {
  }

type Msg = NoOp


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( {}
    , Cmd.none
    )


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  ( model, Cmd.none )


view : Model -> Html Msg
view model =
  div
    [ ]
    [ text "Handling of HTTP responses" ]


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , subscriptions = subscriptions
        , update = update
        }
