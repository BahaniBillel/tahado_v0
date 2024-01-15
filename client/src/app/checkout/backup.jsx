<div className="px-3 md:px-10 py-5">
  <p className="font-bold text-2xl text-right ">: سلة الهدايا </p>
  <div className="  flex  flex-col items-start md:grid grid-cols-2  max-h-full w-full p-3 md:p-5 font-sans rounded-md bg-lightGray">
    <section className="flex flex-col items-center justify-center  py-5 col-span-1 order-1 md:order-2 w-full ">
      <MyToggle
        initialEnabled={true}
        onToggle={(state) => setEnabled(state)}
        enabledColor="bg-green-500"
        disabledColor="bg-red-500"
        ariaLabel="Enable feature"
      />

      {enabled ? (
        <form className="    flex flex-col space-y-3 items-start  md:px-10  w-full ">
          <h1 className="text-xl md:text-2xl text-charcoal font-semibold py-4">
            Enter your delivery address
          </h1>

          {/* fullname */}
          <div className="flex flex-col items-start space-y-1 w-full">
            <label
              for="fullname"
              className=" flex flex-row justify-center items-center whitespace-pre w-full "
            >
              Nom Complet
              <label className="flex flex-grow"></label>
              <label className="">الاسم الكامل</label>
            </label>
            <input
              type="text"
              id="fullname"
              placeholder="Ecrir votre nom et prenom ici..."
              className="input  w-full  "
              required
            />
          </div>

          {/* wilaya et commune */}
          <div className="flex flex-row items-center space-x-3 w-full">
            <div className="w-1/2">
              <label
                for="wilaya"
                className=" flex flex-row justify-center items-center whitespace-pre "
              >
                Wilaya
                <label className="flex flex-grow"></label>
                <label className="">ولاية</label>
              </label>
              <select
                id="wilaya"
                name="wilaya"
                className="input w-full"
                required
                onChange={HandleWilayaChange}
              >
                {wilayaDelivery.map((wilaya) => {
                  return (
                    <option key={wilaya.id} value={wilaya.name}>
                      {wilaya.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-grow"></div>
            <div className="w-1/2">
              <label
                for="commune"
                className=" flex flex-row justify-center items-center whitespace-pre "
              >
                Commune
                <label className="flex flex-grow"></label>
                <label className="">البلدية</label>
              </label>
              <input
                type="text"
                id="commune"
                className="input w-full "
                required
              />
            </div>
          </div>
          {/* Livraison */}
          <div className=" flex-row items-center space-x-3 w-full hidden">
            <div className="w-1/2">
              <label
                for="price"
                className=" flex flex-row justify-center items-center whitespace-pre "
              >
                Livraison
                <label className="flex flex-grow"></label>
                <label className="">السعر</label>
              </label>
              <select
                id="livraison"
                name="livraison"
                className="input w-full"
                disabled
                onChange={(e) => setDelivery(e.target.value)}
              >
                {wilayaDelivery
                  .filter((wilayaObj) => wilayaObj.name === wilaya)
                  .map((wilayaObj) => (
                    <option key={wilayaObj.id} value={wilayaObj.price}>
                      {wilayaObj.price}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* address */}
          <div className="flex flex-col items-start space-y-1 w-full">
            <label
              for="address"
              className=" flex flex-row justify-center items-center whitespace-pre w-full "
            >
              Adresse
              <label className="flex flex-grow"></label>
              <label className="">العنوان</label>
            </label>
            <input
              type="text"
              id="address"
              className=" input  w-full  "
              required
            />
          </div>
          {/* email */}
          <div className="flex flex-row items-center space-x-3 w-full">
            <div className="w-full">
              <label
                for="email"
                className=" flex flex-row justify-center items-center whitespace-pre "
              >
                Votre email
                <label className="flex flex-grow"></label>
                <label className="">البريد الإلكلتروني </label>
              </label>
              <input type="text" id="email" className="input  w-full " />
            </div>
          </div>
          {/* Mobile number */}
          <div className="flex flex-row items-center space-x-3 w-full">
            <div className="w-4/6">
              <label
                for="mobile"
                className=" flex flex-row justify-center items-center whitespace-pre "
              >
                Numéro Telephone
                <label className="flex flex-grow"></label>
                <label className="">رقم الهاتف</label>
              </label>
              <input
                type="text"
                id="mobile"
                className="input  w-full "
                required
              />
            </div>
          </div>

          {/* Extra info */}
          <div className="flex flex-row items-center space-x-3 w-full">
            <div className="w-4/6">
              <label
                for="notes"
                className=" flex flex-row justify-center items-center whitespace-pre "
              >
                Autres Informations
                <label className="flex flex-grow"></label>
                <label className="">معلومات أخرى </label>
              </label>
              <textarea type="text" id="notes" className="input  w-full " />
            </div>
          </div>

          <div className="flex flex-grow"></div>
          <button
            className=" w-full py-3 text-white font-semibold bg-charcoal 
          text-xl hover:scale-95 transition-all ease-in-out duration-150 rounded-md"
            onClick={(e) => SubmitOrderToDatabase(e, total, delivery)}
          >
            Confirmer la commande
          </button>
        </form>
      ) : (
        "recepient"
      )}
    </section>
    <section className="col-span-1 order-2 md:order-1 bg-white px-5 py-5 rounded-md ">
      <p className="font-bold text-xl py-2">
        {isItems.length ? "Vous avez Commandé :" : "There is no items"}
      </p>
      <div>
        {isItems.map((order, i) => (
          <CheckoutProduct
            key={order.product_id}
            productId={order.product_id} //
            name={`${order.giftname}`}
            productImage={order.main_image}
            price={`${order.price}`}
            amount={`${order.quantity * order.price}`}
            sender={order.sender}
            flower_pocket={order.flower_pocket}
            recipient={order.recipient}
            quantity={order.quantity}
            isCheckout={true}
          />
        ))}
      </div>
      {/* Flower fee */}
      <div className="my-5 pt-5 border-t flex flex-col flex-nowrap space-y-5">
        <div className="flex flex-row flex-nowrap items-center w-full ">
          <p>
            {totalFlowerPocketCharge} <span>DA</span>
          </p>
          <p className="flex flex-grow"></p>
          <p>باقة زهور </p>
        </div>
      </div>
      {/* Delivery */}
      <div className="my-5 pt-5 border-t flex flex-col flex-nowrap space-y-5">
        <div className="flex flex-row flex-nowrap items-center w-full ">
          <p>
            {subTotal} <span>DA</span>
          </p>
          <p className="flex flex-grow"></p>
          <p>المجموع الفرعي </p>
        </div>
        <div className="flex flex-row flex-nowrap items-center w-full ">
          <p>
            {items.length ? livraison : null} <span>DA</span>
          </p>
          <p className="flex flex-grow"></p>
          <p>تكاليف التوصيل</p>
        </div>

        <div className=" font-bold border-t pt-3 flex flex-row flex-nowrap items-center w-full ">
          <p>
            <span>دج</span> {items.length ? total : null}
          </p>
          <p className="flex flex-grow"></p>
          <p>المجموع </p>
        </div>
        <div>
          <p className="text-xl font-semibold">Livraison | التوصيل</p>
          <div className=" text-sm flex flex-col space-y-2">
            <p>Est et Ouest : 24 H-72h (Oum Bouaghi - Souk Ahras : 1j-4j)</p>
            <p>Centre : 24h-48h</p>
            <p>Alger : 24h</p>
            <p>Blida : jour meme</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>;
