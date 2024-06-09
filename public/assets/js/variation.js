document.addEventListener("DOMContentLoaded", function () {
  const addVariationBtn = document.querySelector(".add-variation-btn");
  const variationsContainer = document.querySelector("#variations-container");

  addVariationBtn.addEventListener("click", function () {
    const variationInput = document.createElement("input");
    variationInput.type = "text";
    variationInput.className = "form-control variation-input mt-2";
    variationInput.placeholder = "Enter product variation";

    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group";
    inputGroup.appendChild(variationInput);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-outline-secondary remove-variation-btn";
    removeBtn.innerHTML = '<i class="ti ti-minus"></i>';

    removeBtn.addEventListener("click", function () {
      inputGroup.remove();
    });

    const btnDiv = document.createElement("div");
    btnDiv.className = "input-group-append";
    btnDiv.appendChild(removeBtn);

    inputGroup.appendChild(btnDiv);

    variationsContainer.appendChild(inputGroup);
  });
});
