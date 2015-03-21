% Haskellerのための実用オブジェクト指向入門
% @fumieval
% 2015/3/20

自己紹介
-----------
* @fumieval, Fumiaki Kinoshita
* マイブーム: 俳句

![](Icon.png)

Haskell流オブジェクト指向とは
-----------
* 作用(IOやオレオレモナドなど)の圏における射である「オブジェクト」に基づいたパラダイム
* 同じ作用間の射である自然変換と違い、内部状態を隠蔽できる
* ゲームのキャラクターの管理などに便利

オブジェクトを作るには
-----------
1. 内部状態を定義する
2. 命令の集まりを定義する
3. 命令を状態の操作にする関数を組み合わせる
4. 楽しい！✌('ω'✌) 三　✌('ω')✌　三　(✌'ω')✌

ゴブリンオブジェクトを実装したい: 状態
-----------
* __内部状態は位置、速度、HP__
* 操作として描画、攻撃、ジャンプ、移動がある

状態を書く(0)
-----------
extensibleライブラリを使う

```haskell
import Data.Extensible

decFields [d|
    type Position = V2 Float
    type Velocity = V2 Float
    type HitPoint = Int
    |]
```

状態を書く(1)
----------

```haskell
initialGoblin :: AllOf [Position, Velocity, Direction]
initialGoblin = Position (V2 0 0)
    <% Velocity (V2 0 0)
    <% HP
    <% Nil
```

状態を書く(2)
---------

Lensのアクセサが定義される

```haskell
position :: (Position ∈ xs) => Lens' (AllOf xs) (V2 Float)
velocity :: (Velocity ∈ xs) => Lens' (AllOf xs) (V2 Float)
…
```

状態を書く(3)
---------

Lensを通して値を操作する

```haskell
use :: MonadState s m => Lens' s a -> m a
(+=) :: (MonadState s m, Num a) => Lens' s a -> a -> m ()
```

ゴブリンオブジェクトを実装したい(操作)
-----------
* 内部状態は位置、速度、向き、HP
* __操作として描画、攻撃、ジャンプ、移動がある__

インターフェイス
-----------

GADTで操作の型を並べる

```haskell
data Action x where
    Attack :: Action Attack
    Render :: Action Picture
    Jump :: Action ()
    Move :: Float -> Action Bool
```

オブジェクト(0)
-----------

http://hackage.haskell.org/package/objective

![](../papers/ja/2015-Haskell-objects/Object-def.png)

オブジェクト(1)
-----------

```haskell
(@~) :: Monad m
    => s -- 初期状態
    -> (forall a. t a -> StateT s m a) -- 命令の翻訳
    -> Object t m -- オブジェクト
```

オブジェクト(2)
------------

```haskell
goblin :: Monad m => Object Action m
goblin = initialGoblin @~ \case
    Render -> do
        pos <- use position
        return $ translate pos goblinPicture
    Jump -> velocity += V2 0 (-1)
    Move x -> velocity += V2 x 0
    Attack -> hitPoint -= 1
```

使い方(不死)
------------

* `new`と送信演算子`(.-)`がある

```haskell
do i <- new goblin
   i .- Move …
   i .- Jump
```

応用
----------
* Operationalモナド対応 `Object t m -> Object (Program t) m`
* 操作を生み出すAIオブジェクトと先ほどのゴブリンオブジェクトを合成し、自律するゴブリンが作れる
* Object Auto (Program Action) -> Object Action IO -> Object Auto IO`
* 定命のオブジェクト: 文脈をIOではなくEitherTなどにすると死ぬオブジェクトも作れる

* Minecraft風ゲームを作っています

まとめ
----------
<p class="fragment" data-fragment-index="0">
* Haskellは関数型言語
</p>
<p class="fragment" data-fragment-index="1">
* Haskellは手続き型言語
</p>
<p class="fragment" data-fragment-index="2">
* Haskellはオブジェクト指向言語
</p>
<p class="fragment" data-fragment-index="3">
* ご清聴ありがとうございました
</p>
<p class="fragment" data-fragment-index="3">
* Questions?
</p>
